import { FaBars, FaBell, FaSignOutAlt, FaUserCircle, FaCog, FaMoon, FaSun } from "react-icons/fa";
import { useDashboardContext } from "../../pages/dashboard/dashboard";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { showToast } from "../../utils/toast";

// interface User {
//   name?: string;
//   email?: string;
// }

const Navbar = () => {
  {/*user,*/}
  const { toggleSidebar, logoutUser, showSidebar, isDarkTheme, toggleDarkTheme } = useDashboardContext();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  // بستن منوی پروفایل با کلیک خارج از آن
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu')) {
      setShowProfileMenu(false);
    }
  };

  // افزودن event listener برای کلیک خارج از منو
  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // نمایش اعلان‌ها
  const handleNotificationClick = () => {
    showToast.info("در حال بارگذاری اعلان‌ها...");
  };

  return (
    <header className={`w-full ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} p-3 flex justify-between items-center shadow-md sticky top-0 z-50 transition-colors duration-200`} dir="rtl">
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className={`p-1.5 rounded-lg transition-colors duration-200 hover:bg-gray-100
            ${showSidebar ? 'bg-gray-100' : ''} ${isDarkTheme ? 'hover:bg-gray-700' : ''}`}
          aria-label="نمایش/مخفی‌سازی منو"
        >
          <FaBars className={`h-5 w-5 transition-colors duration-200
            ${showSidebar ? 'text-primary' : isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}
          />
        </button>
        <div className="flex items-center gap-1.5">
          <img src="/photos/zoodmiz.svg" alt="لوگوی زودمیز" className="w-7 h-7" />
          <h1 className={`text-lg font-bold ${isDarkTheme ? 'text-white' : 'text-primary'} font-vazirmatn`}>سیستم مدیریت میز و منو</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        {/* دکمه تغییر تم */}
        <button
          onClick={toggleDarkTheme}
          className={`p-1.5 rounded-lg transition-colors duration-200 ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          aria-label="تغییر تم"
        >
          {isDarkTheme ? (
            <FaSun className="h-4 w-4 text-yellow-400" />
          ) : (
            <FaMoon className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {/* اعلان‌ها */}
        <button 
          onClick={handleNotificationClick}
          className={`flex p-1.5 rounded-lg transition-colors duration-200 ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          aria-label="مشاهده اعلان‌ها"
        >
          <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-vazirmatn">
            ۲
          </span>
          <FaBell className={`h-4 w-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`} 
          />
        </button>

        {/* تنظیمات */}
        <Link
          to="/dashboard/settings"
          className={`p-1.5 rounded-lg transition-colors duration-200 ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          aria-label="تنظیمات"
        >
          <FaCog className={`h-4 w-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`} />
        </Link>

        {/* پروفایل کاربر */}
        <div className="relative profile-menu">
          <button
            onClick={toggleProfileMenu}
            className={`flex items-center gap-2 p-2 rounded-lg transition-colors duration-200 ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            aria-label="منوی کاربری"
          >
            {/* <span className={`text-sm font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'} font-vazirmatn`}>
              {(user as User)?.name || 'کاربر گرامی'}
            </span> */}
            <FaUserCircle className={`h-6 w-6 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>

          {/* منوی کشویی پروفایل */}
          {showProfileMenu && (
            <div className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 ${isDarkTheme ? 'bg-gray-800 ring-gray-700' : 'bg-white ring-black'} ring-1 ring-opacity-5`}>
              <Link
                to="profile"
                className={`flex items-center gap-2 px-4 py-2 text-sm ${isDarkTheme ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'} font-vazirmatn`}
              >
                <FaUserCircle className="h-5 w-5" />
                <span>ویرایش پروفایل</span>
              </Link>
              <button
                onClick={logoutUser}
                className={`flex items-center gap-2 px-4 py-2 text-sm text-red-600 ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} w-full font-vazirmatn`}
              >
                <FaSignOutAlt className="h-5 w-5" />
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
