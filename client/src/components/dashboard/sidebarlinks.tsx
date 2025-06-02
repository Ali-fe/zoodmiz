import { FaHome, FaUser, FaShoppingCart, FaClipboardList, FaTable, FaUtensils } from 'react-icons/fa';

const sidebarLinks = [
    { name: 'داشبورد', path: '/dashboard', icon: <FaHome className="w-5 h-5" /> },
    { name: 'غذاها', path: 'edible', icon: <FaUtensils className="w-5 h-5" /> },
    { name: 'منوی سفارش', path: 'menu', icon: <FaClipboardList className="w-5 h-5" /> },
    { name: 'سفارشات', path: 'orders', icon: <FaShoppingCart className="w-5 h-5" /> },
    { name: 'میزها', path: 'tables', icon: <FaTable className="w-5 h-5" /> },
    { name: 'پروفایل', path: 'profile', icon: <FaUser className="w-5 h-5" /> },
];

export default sidebarLinks;