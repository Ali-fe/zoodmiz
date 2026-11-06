import { toPersianNumber } from './persianNumbers';

type Coords = { lat?: number; lng?: number };

// haversine distance in km, null when either point has no coordinates
export const distanceKm = (from: Coords, to: Coords): number | null => {
  const { lat: lat1, lng: lng1 } = from;
  const { lat: lat2, lng: lng2 } = to;
  if ([lat1, lat2, lng1, lng2].some((value) => typeof value !== 'number')) return null;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const radius = 6371;
  const dLat = toRad((lat2 as number) - (lat1 as number));
  const dLng = toRad((lng2 as number) - (lng1 as number));
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1 as number)) * Math.cos(toRad(lat2 as number)) * Math.sin(dLng / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(h));
};

export const formatDistance = (km: number): string =>
  km < 1
    ? `${toPersianNumber(Math.round(km * 1000))} متر`
    : `${toPersianNumber(km < 10 ? km.toFixed(1) : Math.round(km).toString())} کیلومتر`;

export const formatJalaliDateTime = (value: string | number | Date, withTime = true): string => {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      dateStyle: 'full',
      ...(withTime ? { timeStyle: 'short' } : {}),
    }).format(new Date(value));
  } catch {
    return '';
  }
};
