import { useDashboardContext } from '../../pages/dashboard/dashboard';
import SidebarLink from './sidebarlink';
import { FaTimes } from 'react-icons/fa';
import  sidebarLinks  from './sidebarlinks';

const Sidebar = () => {
  const { showSidebar, toggleSidebar, isDarkTheme } = useDashboardContext();

  return (
    <>
      {/* Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 transition-opacity lg:hidden z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} shadow-lg transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static z-30
          ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}
        dir="rtl"
      >
        {/* Sidebar Header */}
        <div className={`flex items-center justify-between p-4 border-b ${isDarkTheme ? 'border-gray-800' : 'border-gray-200'}`}>
          <h2 className={`text-xl font-bold ${isDarkTheme ? 'text-blue-400' : 'text-primary'} font-vazirmatn`}>زودمیز</h2>
          <button
            onClick={toggleSidebar}
            className={`p-2 rounded-md ${isDarkTheme ? 'hover:bg-gray-900' : 'hover:bg-gray-100'} lg:hidden`}
          >
            <FaTimes className={`h-6 w-6 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.path} {...link} />
          ))}
        </nav>

        {/* User Profile Section */}
        <div className={`absolute bottom-0 w-full p-4 border-t ${isDarkTheme ? 'bg-gray-800 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex items-center space-x-reverse space-x-3">
            <div className="flex-1">
              <p className={`text-sm font-medium ${isDarkTheme ? 'text-gray-200' : 'text-gray-900'} font-vazirmatn`}>کاربر گرامی</p>
              <p className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'} font-vazirmatn`}>خوش آمدید</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
