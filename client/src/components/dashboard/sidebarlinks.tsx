import type { ReactNode } from 'react';
import {
  FaBell,
  FaCalendarCheck,
  FaClipboardList,
  FaHome,
  FaImages,
  FaShoppingCart,
  FaTable,
  FaUser,
  FaUtensils,
} from 'react-icons/fa';

export interface SidebarLinkItem {
  name: string;
  path: string;
  icon: ReactNode;
}

export interface SidebarSection {
  label: string;
  links: SidebarLinkItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    label: 'نمای کلی',
    links: [
      { name: 'داشبورد', path: '/dashboard', icon: <FaHome className="h-4 w-4" /> },
      { name: 'اعلان‌ها', path: '/dashboard/notifications', icon: <FaBell className="h-4 w-4" /> },
    ],
  },
  {
    label: 'فرآیند فروش',
    links: [
      { name: 'سفارشات', path: '/dashboard/orders', icon: <FaShoppingCart className="h-4 w-4" /> },
      { name: 'رزروها', path: '/dashboard/reservations', icon: <FaCalendarCheck className="h-4 w-4" /> },
    ],
  },
  {
    label: 'رستوران',
    links: [
      { name: 'خوراکی‌ها', path: '/dashboard/edibles', icon: <FaUtensils className="h-4 w-4" /> },
      { name: 'منو', path: '/dashboard/menu', icon: <FaClipboardList className="h-4 w-4" /> },
      { name: 'میزها', path: '/dashboard/tables', icon: <FaTable className="h-4 w-4" /> },
      { name: 'تصاویر', path: '/dashboard/images', icon: <FaImages className="h-4 w-4" /> },
    ],
  },
  {
    label: 'حساب کاربری',
    links: [
      { name: 'پروفایل', path: '/dashboard/profile', icon: <FaUser className="h-4 w-4" /> },
    ],
  },
];

export default sidebarSections;
