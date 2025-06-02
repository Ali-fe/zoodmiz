import { Link, useLocation } from 'react-router-dom';
import { useDashboardContext } from '../../pages/dashboard/dashboard';

interface SidebarLinkProps {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const SidebarLink = ({ name, path, icon }: SidebarLinkProps) => {
  const location = useLocation();
  const { isDarkTheme } = useDashboardContext();
  const isActive = location.pathname === '/dashboard' + (path === '/dashboard' ? '' : '/' + path);

  return (
    <Link
      to={path === '/dashboard' ? path : `/dashboard/${path}`}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200
        ${isActive
          ? isDarkTheme 
            ? 'bg-blue-500/20 text-blue-400 font-bold border-r-4 border-blue-400'
            : 'bg-primary/10 text-primary font-bold border-r-4 border-primary'
          : isDarkTheme
            ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
            : 'text-gray-700 hover:bg-gray-100'
        }`}
    >
      <div className="flex items-center w-full gap-2" dir="rtl">
        {icon}
        <span>{name}</span>
      </div>
    </Link>
  );
};

export default SidebarLink;
