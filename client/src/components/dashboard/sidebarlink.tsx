import { Link, useLocation } from 'react-router-dom';
import { useDashboardContext } from '../../pages/dashboard/dashboard';
import type { SidebarLinkItem } from './sidebarlinks';

const SidebarLink = ({ name, path, icon }: SidebarLinkItem) => {
  const { toggleSidebar } = useDashboardContext();
  const location = useLocation();
  const isActive = path === '/dashboard' ? location.pathname === path : location.pathname.startsWith(path);

  const handleClick = () => {
    if (window.innerWidth < 768) {
      toggleSidebar();
    }
  };

  return (
    <Link
      onClick={handleClick}
      to={path}
      aria-current={isActive ? 'page' : undefined}
      className={`group relative flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
        isActive
          ? 'bg-gradient-to-l from-primary-100 to-primary-50 font-bold text-primary-800 dark:from-primary-500/25 dark:to-primary-500/5 dark:text-primary-200'
          : 'font-medium text-gray-600 hover:bg-primary-50/70 hover:text-primary-700 dark:text-gray-300 dark:hover:bg-gray-700/50 dark:hover:text-white'
      }`}
    >
      <span
        className={`absolute start-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-primary transition-all duration-200 ${
          isActive ? 'opacity-100' : 'scale-y-50 opacity-0'
        }`}
      />
      <span
        className={`transition-colors duration-200 ${
          isActive
            ? 'text-primary-600 dark:text-primary-300'
            : 'text-gray-400 group-hover:text-primary-600 dark:group-hover:text-primary-300'
        }`}
      >
        {icon}
      </span>
      <span>{name}</span>
    </Link>
  );
};

export default SidebarLink;
