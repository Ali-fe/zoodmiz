import { useDashboardContext } from '../../pages/dashboard/dashboard';
import SidebarLink from './sidebarlink';
import sidebarLinks from '../../data/sidebarlinks';
import { FaTimes } from 'react-icons/fa';

const Sidebar = () => {
  const { showSidebar, toggleSidebar } = useDashboardContext();

  return (
    <>
      {/* Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity lg:hidden z-20"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static z-30
          ${showSidebar ? 'translate-x-0' : 'translate-x-full'}`}
        dir="rtl"
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-primary font-vazirmatn">زودمیز</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-100 lg:hidden"
          >
            <FaTimes className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarLinks.map((link) => (
            <SidebarLink key={link.path} {...link} />
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
          <div className="flex items-center space-x-reverse space-x-3">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 font-vazirmatn">کاربر گرامی</p>
              <p className="text-xs text-gray-500 font-vazirmatn">خوش آمدید</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
