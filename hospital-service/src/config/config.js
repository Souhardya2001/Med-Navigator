const dotenv = require('dotenv');

dotenv.config();

function positiveNumber(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return parsed;
}

function positiveInt(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const maxSearchRadiusKm = positiveNumber(process.env.MAX_SEARCH_RADIUS_KM, 50);
const defaultSearchRadiusKm = Math.min(positiveNumber(process.env.DEFAULT_SEARCH_RADIUS_KM, 10), maxSearchRadiusKm);

module.exports = {
  env: process.env.NODE_ENV || 'development',
  port: positiveInt(process.env.PORT, 5001),
googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || '',
googlePlacesApiUrl: process.env.GOOGLE_PLACES_API_URL ||'https://places.googleapis.com/v1/places:searchNearby',
  externalHospitalApiTimeoutMs: positiveNumber(process.env.EXTERNAL_HOSPITAL_API_TIMEOUT, 10000),
  defaultSearchRadiusKm,
  maxSearchRadiusKm
};