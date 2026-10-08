/**
 * تبدیل اعداد انگلیسی به فارسی
 * @param input - عدد یا رشته‌ای که باید تبدیل شود
 * @returns رشته‌ای با اعداد فارسی
 */
export const toPersianNumber = (input: number | string): string => {
  return input.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

/**
 * تبدیل اعداد فارسی به انگلیسی
 * @param input - رشته‌ای با اعداد فارسی
 * @returns رشته‌ای با اعداد انگلیسی
 */
export const toEnglishNumber = (input: string): string => {
  return input.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d).toString());
};

// تبدیل شماره میز به برچسب مناسب (۰ = بیرون بر)
export function tableNumberToLabel(num: number | string): string {
  if (Number(num) === 0) return 'بیرون بر';
  return toPersianNumber(Number(num).toLocaleString());
} 