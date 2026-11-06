import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowRight, FaCalendarCheck, FaChartLine, FaQrcode, FaUtensils } from 'react-icons/fa';

interface AuthShellProps {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}

const sellingPoints = [
  { icon: FaUtensils, text: 'منو و قیمت‌ها را در چند ثانیه به‌روز کنید.' },
  { icon: FaCalendarCheck, text: 'رزرو میزها را پیش از رسیدن مشتری تایید کنید.' },
  { icon: FaQrcode, text: 'برای هر میز کارت چاپی QR بسازید.' },
  { icon: FaChartLine, text: 'فروش روزانه و محبوب‌ترین غذاها را ببینید.' },
];

const AuthShell = ({ title, subtitle, children, footer }: AuthShellProps) => (
  <div dir="rtl" className="flex min-h-screen bg-cream font-vazirmatn dark:bg-gray-900">
    {/* ستون برند */}
    <div className="relative hidden w-[46%] shrink-0 overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-accent p-10 text-white lg:flex lg:flex-col">
      <span className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
      <span className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-black/10 blur-3xl" />

      <Link to="/" className="relative flex items-center gap-2 text-white/95">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/20 backdrop-blur">
          <img src="/photos/zoodmiz.svg" alt="" className="h-5 w-5" />
        </span>
        <span className="text-lg font-bold font-vazirmatn-title">زودمیز</span>
      </Link>

      <div className="relative mt-auto">
        <h2 className="text-2xl font-bold leading-relaxed font-vazirmatn-title">
          میزها، منو و سفارش‌های رستوران شما
          <br />
          در یک صفحه.
        </h2>
        <ul className="mt-6 space-y-3">
          {sellingPoints.map((point) => (
            <li key={point.text} className="flex items-center gap-3 text-sm text-white/90">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/15 [&>svg]:h-3.5 [&>svg]:w-3.5">
                <point.icon />
              </span>
              {point.text}
            </li>
          ))}
        </ul>
      </div>

      <p className="relative mt-10 text-[11px] text-white/70">
        زودمیز · سامانه آنلاین رزرو میز و مدیریت سفارش
      </p>
    </div>

    {/* ستون فرم */}
    <div className="relative flex flex-1 items-center justify-center p-4">
      <Link
        to="/"
        className="group absolute top-5 end-5 flex items-center gap-2 text-xs font-bold text-gray-500 transition-colors hover:text-primary-600 dark:text-gray-400"
      >
        <FaArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-1" />
        بازگشت به صفحه اصلی
      </Link>

      <div className="w-full max-w-[420px] animate-fade-up rounded-3xl border border-white/60 bg-white/90 p-7 shadow-lift backdrop-blur-xl dark:border-gray-700 dark:bg-gray-800/90">
        <div className="mb-6 text-center lg:text-right">
          <h1 className="text-xl font-bold text-gray-800 dark:text-white font-vazirmatn-title">{title}</h1>
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
        </div>

        {children}

        <div className="mt-6 border-t border-gray-100 pt-4 text-center text-xs text-gray-600 dark:border-gray-700 dark:text-gray-300">
          {footer}
        </div>
      </div>
    </div>
  </div>
);

export default AuthShell;
