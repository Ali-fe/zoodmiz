const { StatusCodes } = require('http-status-codes');
const { getDrivingRoutes } = require('../../services/googleRoutes');

const getDrivingEstimates = async (req, res) => {
  const origin = req.body.origin;
  const destinations = req.body.destinations;
  if (!origin || !Number.isFinite(origin.lat) || !Number.isFinite(origin.lng) ||
      !Array.isArray(destinations) || destinations.length > 10 || destinations.length === 0 ||
      destinations.some(({ id, lat, lng }) => typeof id !== 'string' || !Number.isFinite(lat) || !Number.isFinite(lng))) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'invalid origin or destinations' });
  }
  if (!process.env.GOOGLE_MAPS_API_KEY) {
    return res.status(StatusCodes.SERVICE_UNAVAILABLE).json({ msg: 'Google Maps traffic estimates are not configured' });
  }

  // Routes API computes one destination per request; ten requests run concurrently.
  const results = await Promise.all(destinations.map(async (destination) => {
    try {
      return { id: destination.id, ...(await getDrivingRoutes(origin, [destination])) };
    } catch (error) {
      return { id: destination.id, durationMinutes: null, distanceMeters: null };
    }
  }));
  res.status(StatusCodes.OK).json({ estimates: results, source: 'google-traffic' });
};

module.exports = { getDrivingEstimates };
