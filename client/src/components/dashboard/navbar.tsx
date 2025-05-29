import { FaBars, FaBell, FaSignOutAlt, FaUserCircle, FaCog } from "react-icons/fa";
import { useDashboardContext } from "../../pages/dashboard/dashboard";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { showToast } from "../../utils/toast";

interface User {
  name?: string;
  email?: string;
}

const Navbar = () => {
  const { toggleSidebar, logoutUser, user, showSidebar } = useDashboardContext();
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
    <header className="w-full bg-white text-gray-800 p-4 flex justify-between items-center shadow-md sticky top-0 z-50" dir="rtl">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100
            ${showSidebar ? 'bg-gray-100' : ''}`}
          aria-label="نمایش/مخفی‌سازی منو"
        >
          <FaBars className={`h-6 w-6 transition-colors duration-200
            ${showSidebar ? 'text-primary' : 'text-gray-600'}`}
          />
        </button>
        <div className="flex items-center gap-2">
          <img src="/photos/zoodmiz.svg" alt="لوگوی زودمیز" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-primary font-vazirmatn">سامانه مدیریت رستوران</h1>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* اعلان‌ها */}
        <button 
          onClick={handleNotificationClick}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative"
          aria-label="مشاهده اعلان‌ها"
        >
          <FaBell className="h-5 w-5 text-gray-600" />
          <span className="absolute top-1 left-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-vazirmatn">
            ۲
          </span>
        </button>

        {/* تنظیمات */}
        <Link
          to="/dashboard/settings"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="تنظیمات"
        >
          <FaCog className="h-5 w-5 text-gray-600" />
        </Link>

        {/* پروفایل کاربر */}
        <div className="relative profile-menu">
          <button
            onClick={toggleProfileMenu}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label="منوی کاربری"
          >
            <span className="text-sm font-medium text-gray-700 font-vazirmatn">
              {(user as User)?.name || 'کاربر گرامی'}
            </span>
            <FaUserCircle className="h-6 w-6 text-gray-600" />
          </button>

          {/* منوی کشویی پروفایل */}
          {showProfileMenu && (
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
              <Link
                to="profile"
                className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 font-vazirmatn"
              >
                <FaUserCircle className="h-5 w-5" />
                <span>ویرایش پروفایل</span>
              </Link>
              <button
                onClick={logoutUser}
                className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full font-vazirmatn"
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
