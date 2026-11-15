const hospitalService = require('../services/hospital.service');

async function nearby(req, res, next) {
  try {
    const hospitals = await hospitalService.searchNearby(req.hospitalSearch, req.id);
    res.json({ hospitals });
  } catch (error) { next(error); }
}

module.exports = { nearby };
