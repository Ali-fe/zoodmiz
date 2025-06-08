import { FaHome, FaUser, FaShoppingCart, FaClipboardList, FaTable, FaUtensils, FaImages } from 'react-icons/fa';

const sidebarLinks = [
    { name: 'داشبورد', path: '/dashboard', icon: <FaHome className="w-4 h-4" /> },
    { name: 'غذاها', path: 'edibles', icon: <FaUtensils className="w-4 h-4" /> },
    { name: 'منوی سفارش', path: 'menu', icon: <FaClipboardList className="w-4 h-4" /> },
    { name: 'سفارشات', path: 'orders', icon: <FaShoppingCart className="w-4 h-4" /> },
    { name: 'میزها', path: 'tables', icon: <FaTable className="w-4 h-4" /> },
    { name: 'تصاویر', path: 'images', icon: <FaImages className="w-4 h-4" /> },
    { name: 'پروفایل', path: 'profile', icon: <FaUser className="w-4 h-4" /> },
];

export default sidebarLinks;