const GOOGLE_ROUTES_URL = 'https://routes.googleapis.com/directions/v2:computeRoutes';

const getDrivingRoutes = async (origin, destinations) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) return null;
  const response = await fetch(GOOGLE_ROUTES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask': 'routes.duration,routes.distanceMeters'
    },
    body: JSON.stringify({
      origin: { location: { latLng: { latitude: origin.lat, longitude: origin.lng } } },
      destination: { location: { latLng: { latitude: destinations[0].lat, longitude: destinations[0].lng } } },
      travelMode: 'DRIVE',
      routingPreference: 'TRAFFIC_AWARE',
      departureTime: new Date().toISOString(),
      computeAlternativeRoutes: false,
      languageCode: 'fa-IR',
      units: 'METRIC'
    })
  });
  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.error?.message || 'Google Routes request failed');
    error.status = response.status;
    throw error;
  }
  const route = data.routes?.[0];
  if (!route) return { durationMinutes: null, distanceMeters: null };
  return {
    durationMinutes: Math.max(1, Math.round(Number.parseInt(route.duration, 10) / 60)),
    distanceMeters: route.distanceMeters ?? null
  };
};

module.exports = { getDrivingRoutes };
