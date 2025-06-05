import { toast, ToastOptions } from 'react-toastify';

// تنظیمات پیش‌فرض برای همه toast ها
const defaultOptions: ToastOptions = {
  position: "top-center",
  rtl: true,
  className: "font-vazirmatn-thin text-sm",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// توابع اصلی برای نمایش toast
export const showToast = {
  success: (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  },
  error: (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  },
  info: (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options });
  },
  warning: (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options });
  },
};

// مثال استفاده:
// showToast.success("عملیات با موفقیت انجام شد")
// showToast.error("خطا در انجام عملیات")
// showToast.info("لطفاً صبر کنید...")
// showToast.warning("هشدار!") 