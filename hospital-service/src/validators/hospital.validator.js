const AppError = require('../utils/app-error');
const config = require('../config/config');

function requiredNumber(value, name, minimum, maximum) {
  if (typeof value !== 'string' || !value.trim()) throw new AppError(400, 'INVALID_REQUEST', `${name} is required and must be a number`);
  const number = Number(value);
  if (!Number.isFinite(number) || number < minimum || number > maximum) {
    throw new AppError(400, 'INVALID_REQUEST', `Invalid ${name}`);
  }
  return number;
}

function optionalRadius(value) {
  if (value === undefined) return config.defaultSearchRadiusKm;
  if (typeof value !== 'string' || !value.trim()) throw new AppError(400, 'INVALID_REQUEST', 'Invalid radius');
  const radius = Number(value);
  if (!Number.isFinite(radius) || radius <= 0) throw new AppError(400, 'INVALID_REQUEST', 'Invalid radius');
  if (radius > config.maxSearchRadiusKm) throw new AppError(400, 'INVALID_REQUEST', `Radius must not exceed ${config.maxSearchRadiusKm} km`);
  return radius;
}

function validateNearbySearch(req, _res, next) {
  try {
    const specialty = req.query.specialty;
    if (specialty !== undefined && (typeof specialty !== 'string' || !specialty.trim() || specialty.trim().length > 100)) {
      throw new AppError(400, 'INVALID_REQUEST', 'Specialty must be a non-empty string of at most 100 characters');
    }
    req.hospitalSearch = {
      latitude: requiredNumber(req.query.latitude, 'latitude', -90, 90),
      longitude: requiredNumber(req.query.longitude, 'longitude', -180, 180),
      radius: optionalRadius(req.query.radius),
      ...(specialty !== undefined ? { specialty: specialty.trim() } : {})
    };
    next();
  } catch (error) { next(error); }
}

module.exports = { validateNearbySearch };
