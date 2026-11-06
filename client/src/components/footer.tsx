import { Link } from 'react-router-dom';

interface FooterProps {
  onFeaturesClick?: () => void;
  onHowClick?: () => void;
  onPricingClick?: () => void;
  onFaqClick?: () => void;
  onContactClick?: () => void;
}

const linkClass =
  'text-sm text-gray-300 transition-colors duration-200 hover:text-primary-300 text-start';

const socialClass =
  'grid h-9 w-9 place-items-center rounded-xl bg-white/5 text-gray-400 opacity-70 transition-colors duration-200';

const jalaliYear = () =>
  new Intl.DateTimeFormat('fa-IR', { year: 'numeric' }).format(new Date());

const Footer = ({ onFeaturesClick, onHowClick, onPricingClick, onFaqClick, onContactClick }: FooterProps) => {
  const isLanding = !!(onFeaturesClick || onHowClick || onPricingClick || onFaqClick || onContactClick);

  return (
    <footer className="relative overflow-hidden bg-ink text-white">
      <span className="pointer-events-none absolute -top-24 start-1/4 h-48 w-48 rounded-full bg-primary-500/20 blur-3xl" />
      <div className="container relative mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* برند */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-card">
                <img src="/photos/zoodmiz.svg" alt="" className="h-6 w-6" />
              </span>
              <span className="bg-gradient-to-l from-primary-300 to-primary-500 bg-clip-text font-vazirmatn-title text-2xl font-bold text-transparent">
                زودمیز
              </span>
            </div>
            <p className="text-sm leading-relaxed text-gray-300">
              مدیریت هوشمند رستوران با زودمیز؛ از منو و میز تا سفارش و رزرو.
            </p>
          </div>

          {/* دسترسی سریع */}
          <div>
            <h4 className="mb-4 font-vazirmatn-title text-base font-bold">دسترسی سریع</h4>
            <ul className="space-y-2.5">
              {isLanding ? (
                <>
                  <li>
                    <button type="button" onClick={onFeaturesClick} className={linkClass}>
                      ویژگی‌ها
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={onHowClick} className={linkClass}>
                      چطور کار می‌کند
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={onPricingClick} className={linkClass}>
                      تعرفه‌ها
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={onFaqClick} className={linkClass}>
                      پرسش‌ها
                    </button>
                  </li>
                  <li>
                    <button type="button" onClick={onContactClick} className={linkClass}>
                      تماس با ما
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/restaurants" className={linkClass}>
                      مرور رستوران‌ها
                    </Link>
                  </li>
                  <li>
                    <Link to="/restaurants/reservations" className={linkClass}>
                      رزروهای من
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard/login" className={linkClass}>
                      ورود به داشبورد
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* تماس */}
          <div>
            <h4 className="mb-4 font-vazirmatn-title text-base font-bold">تماس با ما</h4>
            <ul className="space-y-3 text-sm leading-relaxed text-gray-300">
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                همدان، دانشگاه بوعلی سینا، مرکز نوآوری و شتابدهی کندو، طبقه دوم، شرکت زودمیز
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                <span dir="ltr" className="font-vazirmatn">
                  تلفن: 081-4253060 · همراه: 09187114282
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                <span dir="ltr">ایمیل: info@zoodmiz.ir</span>
              </li>
            </ul>
          </div>

          {/* شبکه‌های اجتماعی */}
          <div>
            <h4 className="mb-4 font-vazirmatn-title text-base font-bold">شبکه‌های اجتماعی</h4>
            <div className="flex gap-3">
              <span className={socialClass} title="به‌زودی">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </span>
              <span className={socialClass} title="به‌زودی">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                </svg>
              </span>
              <span className={socialClass} title="به‌زودی">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </span>
            </div>
            <p className="mt-3 text-xs text-gray-400">نشانی شبکه‌های ما به‌زودی اینجا منتشر می‌شود.</p>
          </div>
        </div>

        {/* کپی‌رایت */}
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-gray-400">
          <p>© {jalaliYear()} زودمیز. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
