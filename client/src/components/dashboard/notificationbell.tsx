import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { useDashboardContext } from '../../pages/dashboard/dashboard';
import { useNotifications } from '../../hooks/useNotifications';
import { showToast } from '../../utils/toast';
import { toPersianNumber } from '../../utils/persianNumbers';

const NotificationBell = () => {
  const navigate = useNavigate();
  const { isDarkTheme } = useDashboardContext();
  const { data } = useNotifications();
  const seenIds = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!data) return;
    if (seenIds.current === null) {
      seenIds.current = new Set(data.notifications.map(n => n._id));
      return;
    }
    data.notifications
      .filter(n => !n.isRead && !seenIds.current!.has(n._id))
      .forEach(n => {
        const actor = n.actorName ? ` توسط ${n.actorName}` : '';
        showToast.info(`${n.title}${actor}: ${n.message}`);
      });
    data.notifications.forEach(n => seenIds.current!.add(n._id));
  }, [data]);

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <button
      onClick={() => navigate('/dashboard/notifications')}
      className={`relative p-1.5 rounded-lg transition-colors duration-200 ${isDarkTheme ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
      aria-label={unreadCount > 0 ? `${unreadCount} اعلان خوانده‌نشده` : 'اعلانات'}
    >
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 flex items-center justify-center bg-red-500 text-white text-[10px] leading-none rounded-full font-vazirmatn">
          {toPersianNumber(unreadCount > 99 ? '99+' : unreadCount)}
        </span>
      )}
      <FaBell className={`h-4 w-4 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`} />
    </button>
  );
};

export default NotificationBell;
