import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTimes, FaBars, FaHome, FaUser, FaShoppingCart, FaHeart, FaCog } from 'react-icons/fa';

interface NavItem {
  path: string;
  name: string;
  icon: JSX.Element;
}

const navItems: NavItem[] = [
  { path: '/', name: 'Home', icon: <FaHome className="w-5 h-5" /> },
  { path: '/profile', name: 'Profile', icon: <FaUser className="w-5 h-5" /> },
  { path: '/cart', name: 'Cart', icon: <FaShoppingCart className="w-5 h-5" /> },
  { path: '/favorites', name: 'Favorites', icon: <FaHeart className="w-5 h-5" /> },
  { path: '/settings', name: 'Settings', icon: <FaCog className="w-5 h-5" /> },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-md lg:hidden bg-primary text-white hover:bg-primary-dark"
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-white shadow-xl transition-transform duration-300 ease-in-out transform 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:w-64 z-40`}
      >
        {/* Logo */}
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary">Zoodmiz</h1>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-colors duration-200
                    ${
                      location.pathname === item.path
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar; 