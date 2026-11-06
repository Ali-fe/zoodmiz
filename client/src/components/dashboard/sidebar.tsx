import { FaTimes } from 'react-icons/fa';
import { useDashboardContext } from '../../pages/dashboard/dashboard';
import SidebarLink from './sidebarlink';
import sidebarSections from './sidebarlinks';

interface User {
  name?: string;
  lastName?: string;
  email?: string;
}

const Sidebar = () => {
  const { showSidebar, toggleSidebar, user } = useDashboardContext();
  const account = user as User;
  const fullName = `${account?.name || ''} ${account?.lastName || ''}`.trim();
  const initials = `${(account?.name || '').slice(0, 1)}${(account?.lastName || '').slice(0, 1)}`.trim();

  return (
    <>
      {/* Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 z-20 animate-fade-in bg-ink/50 backdrop-blur-sm transition-opacity lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        dir="rtl"
        className={`fixed top-0 right-0 z-30 h-full w-64 transform border-s border-gray-100 bg-white transition-all duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-800 lg:static lg:translate-x-0 ${
          showSidebar ? 'translate-x-0 shadow-lift' : 'translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4 dark:border-gray-700">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-card">
              <img src="/photos/zoodmiz.svg" alt="" className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <h2 className="text-base font-bold text-primary-700 font-vazirmatn-title dark:text-primary-300">
                زودمیز
              </h2>
              <p className="text-[10px] text-gray-400">پنل مدیریت رستوران</p>
            </div>
          </div>
          <button
            onClick={toggleSidebar}
            aria-label="بستن منو"
            className="grid h-8 w-8 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600 lg:hidden dark:hover:bg-rose-500/15"
          >
            <FaTimes className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-5 overflow-y-auto px-3 py-4" style={{ maxHeight: 'calc(100vh - 152px)' }}>
          {sidebarSections.map((section) => (
            <div key={section.label}>
              <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-wide text-gray-400 dark:text-gray-500">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.links.map((link) => (
                  <SidebarLink key={link.path} {...link} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* User Profile Section */}
        <div className="absolute bottom-0 w-full border-t border-gray-100 bg-gradient-to-l from-primary-50 to-white p-3 dark:border-gray-700 dark:from-primary-500/10 dark:to-gray-800">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xs font-bold text-white shadow-card">
              {initials || 'ز'}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xs font-bold text-gray-800 dark:text-gray-100">
                {fullName || 'کاربر گرامی'}
              </p>
              <p className="truncate text-[10px] text-gray-500 dark:text-gray-400">
                {account?.email || 'خوش آمدید'}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
