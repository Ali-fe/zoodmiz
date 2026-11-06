import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

interface NavbarProps {
  onFeaturesClick?: () => void;
  onHowClick?: () => void;
  onPricingClick?: () => void;
  onFaqClick?: () => void;
  onContactClick?: () => void;
}

const linkClass =
  "relative text-sm text-gray-600 transition-colors duration-200 hover:text-primary-600 after:absolute after:bottom-[-6px] after:start-0 after:h-0.5 after:w-0 after:rounded-full after:bg-primary after:transition-all after:duration-300 hover:after:w-full dark:text-gray-300 dark:hover:text-primary-300";

const Navbar = ({ onFeaturesClick, onHowClick, onPricingClick, onFaqClick, onContactClick }: NavbarProps) => {
  const [open, setOpen] = useState(false);

  const items = [
    { label: "خانه", to: "/", onClick: undefined },
    { label: "ویژگی‌ها", to: undefined, onClick: onFeaturesClick },
    { label: "چطور کار می‌کند", to: undefined, onClick: onHowClick },
    { label: "تعرفه‌ها", to: undefined, onClick: onPricingClick },
    { label: "پرسش‌ها", to: undefined, onClick: onFaqClick },
    { label: "تماس با ما", to: undefined, onClick: onContactClick },
  ];

  const jump = (action?: () => void) => {
    setOpen(false);
    action?.();
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-primary-100/60 bg-cream/85 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/85">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex h-16 items-center justify-between gap-3">
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-white shadow-card ring-1 ring-primary-100 dark:bg-gray-800 dark:ring-gray-700">
              <img src="/photos/zoodmiz.svg" alt="لوگوی زودمیز" className="h-8 w-8" />
            </span>
            <span className="bg-gradient-to-l from-primary-600 to-accent bg-clip-text font-vazirmatn-title text-xl font-bold text-transparent">
              زودمیز
            </span>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {items.map((item) =>
              item.to ? (
                <Link key={item.label} to={item.to} className={linkClass}>
                  {item.label}
                </Link>
              ) : (
                <button key={item.label} type="button" onClick={() => jump(item.onClick)} className={linkClass}>
                  {item.label}
                </button>
              )
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/restaurants"
              className="hidden rounded-xl px-3 py-2 text-sm font-bold text-primary-700 transition-colors duration-200 hover:bg-primary-50 sm:inline-flex dark:text-primary-300 dark:hover:bg-primary-500/10"
            >
              رستوران‌ها
            </Link>
            <Link
              to="/dashboard/register"
              className="hidden rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-card transition-all duration-200 hover:bg-primary-600 hover:shadow-lift active:scale-[.97] sm:inline-flex"
            >
              ثبت‌نام رستوران
            </Link>
            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-label={open ? "بستن منو" : "باز کردن منو"}
              className="grid h-10 w-10 place-items-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-colors duration-200 hover:text-primary-600 lg:hidden dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
            >
              {open ? <FaTimes className="h-4 w-4" /> : <FaBars className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="animate-slide-up border-t border-gray-100 bg-white px-4 pb-4 pt-2 shadow-lift lg:hidden dark:border-gray-700 dark:bg-gray-800">
          <ul className="space-y-1">
            {items.map((item) => (
              <li key={item.label}>
                {item.to ? (
                  <Link
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-primary-50 dark:text-gray-200 dark:hover:bg-primary-500/10"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={() => jump(item.onClick)}
                    className="block w-full rounded-xl px-3 py-2.5 text-right text-sm font-bold text-gray-700 transition-colors hover:bg-primary-50 dark:text-gray-200 dark:hover:bg-primary-500/10"
                  >
                    {item.label}
                  </button>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Link
              to="/restaurants"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-primary-200 px-3 py-2.5 text-center text-sm font-bold text-primary-700 transition-colors hover:bg-primary-50 dark:border-primary-500/30 dark:text-primary-300"
            >
              رستوران‌ها
            </Link>
            <Link
              to="/dashboard/register"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-primary px-3 py-2.5 text-center text-sm font-bold text-white transition-colors hover:bg-primary-600"
            >
              ثبت‌نام رستوران
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
