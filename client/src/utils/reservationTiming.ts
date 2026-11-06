import type { Tone } from '../components/dashboard/tones';
import { formatJalaliDateTime } from './geo';
import { toPersianNumber } from './persianNumbers';

const startOfDay = (value: number) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

/** برچسب زمانی «چقدر مانده» برای رزرو؛ هم در داشبورد و هم در صفحه مشتری استفاده می‌شود */
export const whenLabel = (reserveAt: string): { text: string; tone: Tone } => {
  const diff = new Date(reserveAt).getTime() - Date.now();
  if (diff < 0) return { text: 'گذشته', tone: 'neutral' };

  const hours = Math.floor(diff / 3_600_000);
  const days = Math.round((startOfDay(new Date(reserveAt).getTime()) - startOfDay(Date.now())) / 86_400_000);

  if (hours < 1) return { text: 'کمتر از یک ساعت دیگر', tone: 'danger' };
  if (hours < 24 && days === 0) return { text: `${toPersianNumber(hours)} ساعت دیگر`, tone: 'warning' };
  if (days === 0) return { text: 'امروز', tone: 'danger' };
  if (days === 1) return { text: 'فردا', tone: 'warning' };
  if (days <= 7) return { text: `${toPersianNumber(days)} روز دیگر`, tone: 'info' };
  return { text: formatJalaliDateTime(reserveAt).split(' ')[0], tone: 'neutral' };
};
