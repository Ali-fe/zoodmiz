// وضعیت‌های سفارش و معادل فارسی آن‌ها
export const orderStatus: Record<string, string> = {
  pending: 'در انتظار',
  preparing: 'در حال آماده‌سازی',
  ready: 'آماده',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده',
}; 