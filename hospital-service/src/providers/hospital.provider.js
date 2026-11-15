const config = require('../config/config');
const AppError = require('../utils/app-error');
const logger = require('../utils/logger');

function numberOrUndefined(value) {
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

function normalizeLocation(raw) {
  const location = raw.location;

  if (!location || typeof location !== 'object') {
    return undefined;
  }

  const latitude = numberOrUndefined(location.latitude);
  const longitude = numberOrUndefined(location.longitude);

  if (latitude === undefined || longitude === undefined) {
    return undefined;
  }

  return { latitude, longitude };
}

function normalizeString(value) {
  return typeof value === 'string' && value.trim()
    ? value.trim()
    : undefined;
}

function normalizeSpecialties(raw) {
  const values = raw.types;

  if (
    !Array.isArray(values) ||
    !values.every(
      (value) =>
        typeof value === 'string' &&
        value.trim()
    )
  ) {
    return undefined;
  }

  return values.map((value) => value.trim());
}

function calculateDistanceKm(
  latitude1,
  longitude1,
  latitude2,
  longitude2
) {
  const earthRadiusKm = 6371;

  const toRadians = (degrees) =>
    degrees * (Math.PI / 180);

  const dLatitude = toRadians(
    latitude2 - latitude1
  );

  const dLongitude = toRadians(
    longitude2 - longitude1
  );

  const a =
    Math.sin(dLatitude / 2) ** 2 +
    Math.cos(toRadians(latitude1)) *
      Math.cos(toRadians(latitude2)) *
      Math.sin(dLongitude / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return Number(
    (earthRadiusKm * c).toFixed(2)
  );
}

function normalizeHospital(
  raw,
  userLatitude,
  userLongitude
) {
  if (
    !raw ||
    typeof raw !== 'object' ||
    Array.isArray(raw)
  ) {
    throw new AppError(
      502,
      'HOSPITAL_PROVIDER_INVALID_RESPONSE',
      'Hospital provider returned an invalid response'
    );
  }

  const hospital = {};

  // Google Places ID
  const id = normalizeString(raw.id);

  // Google Places display name
  const name = normalizeString(
    raw.displayName?.text
  );

  // Google formatted address
  const address = normalizeString(
    raw.formattedAddress
  );

  // Google location
  const location = normalizeLocation(raw);

  // Google phone numbers
  const phone = normalizeString(
    raw.internationalPhoneNumber ??
      raw.nationalPhoneNumber
  );

  // Google website
  const website = normalizeString(
    raw.websiteUri
  );

  // Google place types
  const specialties =
    normalizeSpecialties(raw);

  if (id) {
    hospital.id = id;
  }

  if (name) {
    hospital.name = name;
  }

  if (address) {
    hospital.address = address;
  }

  if (location) {
    hospital.location = location;
  }

  if (location) {
    hospital.distance = calculateDistanceKm(
      userLatitude,
      userLongitude,
      location.latitude,
      location.longitude
    );
  }

  if (phone) {
    hospital.phone = phone;
  }

  if (website) {
    hospital.website = website;
  }

  if (specialties) {
    hospital.specialties = specialties;
  }

  if (!hospital.name) {
    throw new AppError(
      502,
      'HOSPITAL_PROVIDER_INVALID_RESPONSE',
      'Hospital provider returned an invalid response'
    );
  }

  return hospital;
}

function providerResults(body) {
  if (
    !body ||
    typeof body !== 'object' ||
    Array.isArray(body)
  ) {
    throw new AppError(
      502,
      'HOSPITAL_PROVIDER_INVALID_RESPONSE',
      'Hospital provider returned an invalid response'
    );
  }

  // Google Places API (New) returns `places`
  const results =
    body.places ??
    body.results ??
    body.hospitals ??
    body.data;

  if (!Array.isArray(results)) {
    throw new AppError(
      502,
      'HOSPITAL_PROVIDER_INVALID_RESPONSE',
      'Hospital provider returned an invalid response'
    );
  }

  return results;
}

async function searchNearby(
  { latitude, longitude, radius, specialty },
  requestId
) {
  if (!config.googlePlacesApiKey) {
    throw new AppError(
      502,
      'HOSPITAL_PROVIDER_UNAVAILABLE',
      'Google Places API key is not configured'
    );
  }

  const controller = new AbortController();

  const timer = setTimeout(
    () =>
      controller.abort(),
    config.externalHospitalApiTimeoutMs
  );

  try {
    logger.info(
      'hospital_provider_request_started',
      {
        requestId,
        latitude,
        longitude,
        radius,
        specialty: specialty || undefined
      }
    );

    /*
     * Google Nearby Search expects radius in meters.
     * Our API accepts radius in kilometers.
     */
    const radiusInMeters = radius * 1000;

    const requestBody = {
      includedTypes: ['hospital'],

      maxResultCount: 20,

      rankPreference: 'DISTANCE',

      locationRestriction: {
        circle: {
          center: {
            latitude,
            longitude
          },
          radius: radiusInMeters
        }
      },

      regionCode: 'IN'
    };

    /*
     * NOTE:
     * `specialty` is currently not sent to Google Nearby Search.
     *
     * Nearby Search supports place-type filtering,
     * but medical specialties such as cardiology are
     * not represented as a direct hospital-specialty
     * filter here.
     *
     * We can implement specialty search separately
     * using Text Search (New) later.
     */

    const response = await fetch(
      config.googlePlacesApiUrl,
      {
        method: 'POST',

        headers: {
  'Content-Type': 'application/json',

  'X-Goog-Api-Key':
    config.googlePlacesApiKey,

  'X-Goog-FieldMask':
    [
      'places.id',
      'places.displayName',
      'places.formattedAddress',
      'places.location',
      'places.types'
    ].join(',')
},

        body: JSON.stringify(requestBody),

        signal: controller.signal
      }
    );

    if (response.status === 429) {
      throw new AppError(
        429,
        'HOSPITAL_PROVIDER_RATE_LIMITED',
        'Hospital provider rate limit exceeded'
      );
    }

    if (!response.ok) {
      const errorBody =
        await response.text();

      logger.warn(
        'hospital_provider_failure',
        {
          requestId,
          status: response.status,
          body: errorBody
        }
      );

      throw new AppError(
        502,
        'HOSPITAL_PROVIDER_UNAVAILABLE',
        'Hospital provider is unavailable'
      );
    }

    const responseBody =
      await response.json();

    const results =
      providerResults(responseBody);

    return results.map((hospital) =>
      normalizeHospital(
        hospital,
        latitude,
        longitude
      )
    );

  } catch (error) {
    if (error instanceof AppError) {
      if (error.statusCode >= 500) {
        logger.warn(
          'hospital_provider_failure',
          {
            requestId,
            code: error.code
          }
        );
      }

      throw error;
    }

    if (error.name === 'AbortError') {
      logger.warn(
        'hospital_provider_timeout',
        { requestId }
      );

      throw new AppError(
        504,
        'HOSPITAL_PROVIDER_TIMEOUT',
        'Hospital provider timed out'
      );
    }

    if (error instanceof SyntaxError) {
      logger.warn(
        'hospital_provider_failure',
        {
          requestId,
          code:
            'HOSPITAL_PROVIDER_INVALID_RESPONSE'
        }
      );

      throw new AppError(
        502,
        'HOSPITAL_PROVIDER_INVALID_RESPONSE',
        'Hospital provider returned an invalid response'
      );
    }

    logger.warn(
      'hospital_provider_failure',
      {
        requestId,
        reason: error.name
      }
    );

    throw new AppError(
      502,
      'HOSPITAL_PROVIDER_UNAVAILABLE',
      'Hospital provider is unavailable'
    );

  } finally {
    clearTimeout(timer);
  }
}

module.exports = {
  searchNearby,
  normalizeHospital,
  providerResults
};