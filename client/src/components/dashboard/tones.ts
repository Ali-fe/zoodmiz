export type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export const badgeTones: Record<Tone, string> = {
  neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-200',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  danger: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  info: 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300',
};

export const iconToneClass: Record<Tone, string> = {
  neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300',
  success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
  warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  danger: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
  info: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300',
};

/* یک جدول واحد برای رنگ وضعیت سفارش، میز و رزرو */
const statusTones: Record<string, Tone> = {
  pending: 'warning',
  preparing: 'info',
  ready: 'success',
  delivered: 'neutral',
  confirmed: 'info',
  completed: 'success',
  available: 'success',
  occupied: 'danger',
  reserved: 'warning',
  cancelled: 'danger',
};

export const statusTone = (status: string): Tone => statusTones[status] ?? 'neutral';
