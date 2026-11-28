const { StatusCodes } = require('http-status-codes');
const { getDrivingRoutes } = require('../../services/googleRoutes');
const { getNeshanDrivingRoute } = require('../../services/neshanRoutes');

const getDrivingEstimates = async (req, res) => {
  const origin = req.body.origin;
  const destinations = req.body.destinations;
  if (!origin || !Number.isFinite(origin.lat) || !Number.isFinite(origin.lng) ||
      !Array.isArray(destinations) || destinations.length > 10 || destinations.length === 0 ||
      destinations.some(({ id, lat, lng }) => typeof id !== 'string' || !Number.isFinite(lat) || !Number.isFinite(lng))) {
    return res.status(StatusCodes.BAD_REQUEST).json({ msg: 'invalid origin or destinations' });
  }
  // Query enabled providers concurrently and keep results independently available.
  const estimates = await Promise.all(destinations.map(async (destination) => {
    try {
      const [google, neshan] = await Promise.all([
        getDrivingRoutes(origin, [destination]).catch(() => null),
        getNeshanDrivingRoute(origin, destination).catch(() => null)
      ]);
      return { id: destination.id, google, neshan };
    } catch (error) {
      return { id: destination.id, google: null, neshan: null };
    }
  }));
  res.status(StatusCodes.OK).json({ estimates, providers: {
    google: Boolean(process.env.GOOGLE_MAPS_API_KEY),
    neshan: Boolean(process.env.NESHAN_SERVICE_API_KEY)
  } });
};

module.exports = { getDrivingEstimates };
