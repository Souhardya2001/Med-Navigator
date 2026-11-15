const hospitalProvider = require("../providers/hospital.provider");
const logger = require("../utils/logger");

async function searchNearby(search, requestId) {
  logger.info("hospital_search_requested", {
    requestId,
    latitude: search.latitude,
    longitude: search.longitude,
    radius: search.radius,
    hasSpecialty: Boolean(search.specialty),
  });
  const hospitals = await hospitalProvider.searchNearby(search, requestId);
  logger.info("hospital_search_completed", {
    requestId,
    resultCount: hospitals.length,
  });
  return hospitals;
}

module.exports = { searchNearby };
