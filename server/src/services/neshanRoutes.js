const getNeshanDrivingRoute = async (origin, destination) => {
  const apiKey = process.env.NESHAN_SERVICE_API_KEY;
  if (!apiKey) return null;
  const params = new URLSearchParams({
    type: 'car',
    origin: `${origin.lat},${origin.lng}`,
    destination: `${destination.lat},${destination.lng}`,
    avoidTrafficZone: 'false',
    avoidOddEvenZone: 'false',
    alternative: 'false'
  });
  const response = await fetch(`https://api.neshan.org/v4/direction?${params}`, {
    headers: { 'Api-Key': apiKey, Accept: 'application/json' }
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || 'Neshan routing request failed');
  const leg = data.routes?.[0]?.legs?.[0];
  if (!leg || !Number.isFinite(leg.duration?.value)) return { durationMinutes: null, distanceMeters: null };
  return {
    durationMinutes: Math.max(1, Math.round(leg.duration.value / 60)),
    distanceMeters: leg.distance?.value ?? null
  };
};

module.exports = { getNeshanDrivingRoute };
