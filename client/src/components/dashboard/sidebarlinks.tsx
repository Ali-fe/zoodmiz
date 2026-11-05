import { FaHome, FaUser, FaShoppingCart, FaClipboardList, FaTable, FaUtensils, FaImages, FaBell, FaCalendarCheck } from 'react-icons/fa';

const sidebarLinks = [
    { name: 'داشبورد', path: '/dashboard', icon: <FaHome className="w-4 h-4" /> },
    { name: 'اعلانات', path: 'notifications', icon: <FaBell className="w-4 h-4" /> },
    { name: 'خوراکی ها', path: 'edibles', icon: <FaUtensils className="w-4 h-4" /> },
    { name: 'منو', path: 'menu', icon: <FaClipboardList className="w-4 h-4" /> },
    { name: 'سفارشات', path: 'orders', icon: <FaShoppingCart className="w-4 h-4" /> },
    { name: 'میزها', path: 'tables', icon: <FaTable className="w-4 h-4" /> },
    { name: 'رزروها', path: 'reservations', icon: <FaCalendarCheck className="w-4 h-4" /> },
    { name: 'تصاویر', path: 'images', icon: <FaImages className="w-4 h-4" /> },
    { name: 'پروفایل', path: 'profile', icon: <FaUser className="w-4 h-4" /> },
];

export default sidebarLinks;