import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUtensils, FaClipboardList, FaShoppingCart, FaTable, FaUser } from 'react-icons/fa';

type SidebarLinkProps = {
  name: string;
  path: string;
};

const getIcon = (path: string) => {
  switch (path) {
    case '/dashboard':
      return <FaHome className="w-5 h-5" />;
    case 'edible':
      return <FaUtensils className="w-5 h-5" />;
    case 'menu':
      return <FaClipboardList className="w-5 h-5" />;
    case 'orders':
      return <FaShoppingCart className="w-5 h-5" />;
    case 'tables':
      return <FaTable className="w-5 h-5" />;
    case 'profile':
      return <FaUser className="w-5 h-5" />;
    default:
      return <FaClipboardList className="w-5 h-5" />;
  }
};

const SidebarLink = ({ name, path }: SidebarLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === '/dashboard' + (path === '/dashboard' ? '' : '/' + path);

  return (
    <Link
      to={path === '/dashboard' ? path : `/dashboard/${path}`}
      className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all duration-200
        ${isActive
          ? 'bg-primary/10 text-primary font-bold border-r-4 border-primary'
          : 'text-gray-700 hover:bg-gray-100'
        }`}
    >
      <div className="flex items-center w-full gap-2" dir="rtl">
        {getIcon(path)}
        <span className="font-vazirmatn">{name}</span>
      </div>
    </Link>
  );
};

export default SidebarLink;
