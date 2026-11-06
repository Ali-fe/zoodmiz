import { FaBars, FaCog, FaMoon, FaSignOutAlt, FaSun, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDashboardContext } from "../../pages/dashboard/dashboard";
import Search from "./search";
import NotificationBell from "./notificationbell";

const shellButton =
  "grid h-9 w-9 place-items-center rounded-xl text-gray-500 transition-all duration-200 hover:bg-primary-50 hover:text-primary-600 active:scale-95 dark:text-gray-300 dark:hover:bg-primary-500/15 dark:hover:text-primary-300";

const Navbar = () => {
  const { toggleSidebar, logoutUser, isDarkTheme, toggleDarkTheme, setSearchQuery, user } =
    useDashboardContext();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!(event.target as HTMLElement).closest(".profile-menu")) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const firstName = user?.name || "";
  const lastName = user?.lastName || "";
  const initials = `${firstName.slice(0, 1)}${lastName.slice(0, 1)}`.trim();

  return (
    <header
      dir="rtl"
      className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-gray-100 bg-white/85 px-3 py-2.5 backdrop-blur-xl transition-colors duration-200 dark:border-gray-700 dark:bg-gray-800/85"
    >
      <div className="flex items-center gap-2.5">
        <button onClick={toggleSidebar} className={shellButton} aria-label="نمایش/مخفی‌سازی منو">
          <FaBars className="h-4 w-4" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-card">
            <img src="/photos/zoodmiz.svg" alt="لوگوی زودمیز" className="h-5 w-5" />
          </span>
          <span className="hidden sm:block leading-tight">
            <span className="block text-sm font-bold text-primary-700 font-vazirmatn-title dark:text-primary-300">
              زودمیز
            </span>
            <span className="block text-[10px] text-gray-400 dark:text-gray-400">
              مدیریت میز و منو
            </span>
          </span>
        </Link>
      </div>

      <Search onSearch={setSearchQuery} />

      <div className="flex items-center gap-1.5">
        <button
          onClick={toggleDarkTheme}
          className={shellButton}
          aria-label={isDarkTheme ? "حالت روشن" : "حالت تاریک"}
          title={isDarkTheme ? "حالت روشن" : "حالت تاریک"}
        >
          {isDarkTheme ? <FaSun className="h-4 w-4 text-primary-400" /> : <FaMoon className="h-4 w-4" />}
        </button>

        <NotificationBell />

        <Link to="/dashboard/settings" className={shellButton} aria-label="تنظیمات" title="تنظیمات">
          <FaCog className="h-4 w-4" />
        </Link>

        <div className="relative profile-menu">
          <button
            onClick={() => setShowProfileMenu((open) => !open)}
            className="flex items-center gap-2 rounded-xl p-1 pe-2 transition-colors hover:bg-primary-50 dark:hover:bg-primary-500/15"
            aria-label="منوی کاربری"
            aria-expanded={showProfileMenu}
          >
            {initials ? (
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xs font-bold text-white shadow-card">
                {initials}
              </span>
            ) : (
              <FaUserCircle className="h-8 w-8 text-gray-400" />
            )}
            <span className="hidden max-w-[120px] truncate text-xs font-bold text-gray-600 md:block dark:text-gray-300">
              {`${firstName} ${lastName}`.trim() || "کاربر گرامی"}
            </span>
          </button>

          {showProfileMenu && (
            <div className="absolute left-0 mt-2 w-52 origin-top-left animate-scale-in overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lift dark:border-gray-700 dark:bg-gray-800">
              <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 dark:border-gray-700">
                <FaUserCircle className="h-7 w-7 text-primary-500" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-bold text-gray-800 dark:text-gray-100">
                    {`${firstName} ${lastName}`.trim() || "کاربر گرامی"}
                  </p>
                  <p className="truncate text-[10px] text-gray-400">{user?.email || ""}</p>
                </div>
              </div>
              <Link
                to="profile"
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:text-gray-200 dark:hover:bg-primary-500/15"
              >
                <FaUserCircle className="h-4 w-4" />
                <span>ویرایش پروفایل</span>
              </Link>
              <button
                onClick={logoutUser}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-rose-600 transition-colors hover:bg-rose-50 dark:text-rose-300 dark:hover:bg-rose-500/15"
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span>خروج از حساب</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
