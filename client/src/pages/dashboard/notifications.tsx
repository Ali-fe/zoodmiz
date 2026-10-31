import { useState } from 'react';
import type { IconType } from 'react-icons';
import {
  FaBell,
  FaCheckDouble,
  FaClipboardList,
  FaSpinner,
  FaTable,
  FaUser,
  FaUtensils,
} from 'react-icons/fa';
import { useDashboardContext } from './dashboard';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  getNotificationCategory,
  type AppNotification,
  type NotificationCategory,
} from '../../hooks/useNotifications';
import { toPersianNumber } from '../../utils/persianNumbers';

type CategoryFilter = 'all' | NotificationCategory;

const categoryStyles: Record<NotificationCategory, {
  icon: IconType;
  iconClass: string;
  darkIconClass: string;
  borderClass: string;
  dotClass: string;
}> = {
  order: {
    icon: FaClipboardList,
    iconClass: 'bg-blue-100 text-blue-600',
    darkIconClass: 'bg-blue-500/20 text-blue-400',
    borderClass: 'border-r-blue-500',
    dotClass: 'bg-blue-500',
  },
  edible: {
    icon: FaUtensils,
    iconClass: 'bg-emerald-100 text-emerald-600',
    darkIconClass: 'bg-emerald-500/20 text-emerald-400',
    borderClass: 'border-r-emerald-500',
    dotClass: 'bg-emerald-500',
  },
  table: {
    icon: FaTable,
    iconClass: 'bg-amber-100 text-amber-600',
    darkIconClass: 'bg-amber-500/20 text-amber-400',
    borderClass: 'border-r-amber-500',
    dotClass: 'bg-amber-500',
  },
};

const categoryTabs: { key: CategoryFilter; label: string; icon?: IconType }[] = [
  { key: 'all', label: 'همه' },
  { key: 'order', label: 'سفارشات', icon: FaClipboardList },
  { key: 'edible', label: 'خوراکی‌ها', icon: FaUtensils },
  { key: 'table', label: 'میزها', icon: FaTable },
];

const formatDate = (value: string) =>
  new Date(value).toLocaleString('fa-IR', {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

const NotificationCard = ({
  notification,
  isDarkTheme,
  onRead,
}: {
  notification: AppNotification;
  isDarkTheme: boolean;
  onRead: (id: string) => void;
}) => {
  const category = getNotificationCategory(notification);
  const styles = categoryStyles[category];
  const Icon = styles.icon;

  return (
    <button
      type="button"
      onClick={() => !notification.isRead && onRead(notification._id)}
      className={`w-full text-right flex items-start gap-3 p-3 rounded-lg shadow-sm border transition-colors duration-200 ${
        isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } ${
        notification.isRead ? '' : `border-r-4 ${styles.borderClass}`
      }`}
    >
      <div
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          isDarkTheme ? styles.darkIconClass : styles.iconClass
        }`}
      >
        <Icon />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`text-sm font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
            {notification.title}
          </h3>
          <span className={`text-xs shrink-0 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatDate(notification.createdAt)}
          </span>
        </div>
        <p className={`text-sm mt-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
          {notification.message}
        </p>
        {notification.actorName && (
          <p className={`text-xs mt-1.5 flex items-center gap-1.5 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
            <FaUser className="text-[10px]" />
            توسط {notification.actorName}
          </p>
        )}
        {!notification.isRead && (
          <span className="inline-flex items-center gap-1 text-xs text-blue-500 mt-1.5">
            <span className={`w-2 h-2 rounded-full ${styles.dotClass}`}></span>
            خوانده‌نشده
          </span>
        )}
      </div>
    </button>
  );
};

const Notifications = () => {
  const { isDarkTheme } = useDashboardContext();
  const { data, isLoading, isError, error } = useNotifications();
  const { mutate: markRead, isPending: isMarking } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  const baseNotifications = unreadOnly
    ? notifications.filter(n => !n.isRead)
    : notifications;
  const filteredNotifications = category === 'all'
    ? baseNotifications
    : baseNotifications.filter(n => getNotificationCategory(n) === category);

  const countFor = (key: CategoryFilter) =>
    key === 'all'
      ? baseNotifications.length
      : baseNotifications.filter(n => getNotificationCategory(n) === key).length;

  const tabClass = (value: CategoryFilter) =>
    `flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-colors duration-200 ${
      category === value
        ? isDarkTheme
          ? 'bg-blue-600 text-white'
          : 'bg-blue-500 text-white'
        : isDarkTheme
          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          : 'bg-white text-gray-700 hover:bg-gray-100'
    }`;

  const emptyMessage = unreadOnly
    ? 'اعلان خوانده‌نشده‌ای در این دسته ندارید'
    : category === 'all'
      ? 'هنوز اعلانی ثبت نشده است'
      : 'هنوز اعلانی در این دسته ثبت نشده است';

  return (
    <div className={`p-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <h1 className={`text-l font-bold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
            اعلانات
          </h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 font-bold">
              {toPersianNumber(unreadCount)}
            </span>
          )}
        </div>
        <button
          onClick={() => markAllRead()}
          disabled={unreadCount === 0 || isMarkingAll}
          className={`px-3 py-1.5 text-sm rounded-md font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            isDarkTheme
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isMarkingAll ? (
            <FaSpinner className="animate-spin inline-block ml-1.5" />
          ) : (
            <FaCheckDouble className="inline-block ml-1.5" />
          )}
          خواندن همه
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div className={`inline-flex flex-wrap rounded-md overflow-hidden border ${isDarkTheme ? 'border-gray-700' : 'border-gray-300'}`}>
          {categoryTabs.map(tab => {
            const TabIcon = tab.icon;
            return (
              <button key={tab.key} onClick={() => setCategory(tab.key)} className={tabClass(tab.key)}>
                {TabIcon && <TabIcon className="text-xs" />}
                {tab.label} ({toPersianNumber(countFor(tab.key))})
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setUnreadOnly(value => !value)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors duration-200 ${
            unreadOnly
              ? 'bg-red-500 border-red-500 text-white'
              : isDarkTheme
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          فقط خوانده‌نشده
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <FaSpinner className={`animate-spin text-3xl ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-4">
          خطا در بارگذاری اعلان‌ها: {error?.message}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className={`flex flex-col items-center justify-center py-16 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
          <FaBell className="text-4xl mb-3" />
          <p>{emptyMessage}</p>
        </div>
      ) : (
        <div className={`space-y-3 ${isMarking ? 'opacity-90' : ''}`}>
          {filteredNotifications.map(notification => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              isDarkTheme={isDarkTheme}
              onRead={markRead}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
