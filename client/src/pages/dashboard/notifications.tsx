import { useEffect, useMemo, useState } from 'react';
import type { IconType } from 'react-icons';
import {
  FaBell,
  FaCheckDouble,
  FaClipboardList,
  FaInbox,
  FaTable,
  FaUser,
  FaUtensils,
} from 'react-icons/fa';
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
  Segmented,
  TablePager,
} from '../../components/dashboard/ui';
import { iconToneClass, type Tone } from '../../components/dashboard/tones';
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

const categoryStyles: Record<NotificationCategory, { icon: IconType; tone: Tone }> = {
  order: { icon: FaClipboardList, tone: 'info' },
  edible: { icon: FaUtensils, tone: 'success' },
  table: { icon: FaTable, tone: 'warning' },
};

const categoryTabs: { key: CategoryFilter; label: string }[] = [
  { key: 'all', label: 'همه' },
  { key: 'order', label: 'سفارشات' },
  { key: 'edible', label: 'خوراکی‌ها' },
  { key: 'table', label: 'میزها' },
];

const PAGE_SIZE = 15;

const relativeTime = (value: string) => {
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'همین الان';
  if (minutes < 60) return `${toPersianNumber(minutes)} دقیقه پیش`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${toPersianNumber(hours)} ساعت پیش`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${toPersianNumber(days)} روز پیش`;
  return new Date(value).toLocaleDateString('fa-IR', { month: 'long', day: 'numeric' });
};

const NotificationCard = ({
  notification,
  onRead,
}: {
  notification: AppNotification;
  onRead: (id: string) => void;
}) => {
  const category = getNotificationCategory(notification);
  const styles = categoryStyles[category];
  const Icon = styles.icon;

  return (
    <Panel
      className={`w-full animate-fade-up text-right transition-all duration-200 hover:shadow-lift ${
        notification.isRead ? 'opacity-80' : 'ring-1 ring-primary-100 dark:ring-primary-500/20'
      }`}
    >
      <button
        type="button"
        onClick={() => !notification.isRead && onRead(notification._id)}
        className="flex w-full items-start gap-3 p-3.5 text-right"
      >
        <span className={`relative grid h-10 w-10 shrink-0 place-items-center rounded-xl [&>svg]:h-4 [&>svg]:w-4 ${iconToneClass[styles.tone]}`}>
          <Icon />
          {!notification.isRead && (
            <span className="absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white dark:ring-gray-800" />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
              {notification.title}
            </span>
            <span className="shrink-0 text-[11px] text-gray-500 dark:text-gray-400">
              {relativeTime(notification.createdAt)}
            </span>
          </span>
          <span className="mt-1 block text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            {notification.message}
          </span>
          <span className="mt-2 flex flex-wrap items-center gap-2">
            <Badge tone={styles.tone}>
              {categoryTabs.find((tab) => tab.key === category)?.label}
            </Badge>
            {notification.actorName && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-500 dark:text-gray-400">
                <FaUser className="h-2.5 w-2.5" />
                توسط {notification.actorName}
              </span>
            )}
            {!notification.isRead && (
              <span className="text-[11px] font-bold text-primary-600 dark:text-primary-300">
                ناخوانده
              </span>
            )}
          </span>
        </span>
      </button>
    </Panel>
  );
};

const Notifications = () => {
  const { data, isLoading, isError, error, refetch } = useNotifications();
  const { mutate: markRead, isPending: isMarking } = useMarkNotificationRead();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();
  const [category, setCategory] = useState<CategoryFilter>('all');
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [page, setPage] = useState(0);

  const notifications = useMemo(() => data?.notifications ?? [], [data]);
  const unreadCount = data?.unreadCount ?? 0;

  const filteredNotifications = useMemo(() => {
    const base = unreadOnly
      ? notifications.filter((n) => !n.isRead)
      : notifications;
    return category === 'all'
      ? base
      : base.filter((n) => getNotificationCategory(n) === category);
  }, [notifications, category, unreadOnly]);

  useEffect(() => {
    setPage(0);
  }, [category, unreadOnly]);

  const pagedNotifications = filteredNotifications.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE
  );

  const countFor = (key: CategoryFilter) => {
    const base = unreadOnly ? notifications.filter((n) => !n.isRead) : notifications;
    return key === 'all' ? base.length : base.filter((n) => getNotificationCategory(n) === key).length;
  };

  const emptyMessage = unreadOnly
    ? 'اعلان ناخوانده‌ای در این دسته ندارید'
    : category === 'all'
      ? 'هنوز اعلانی ثبت نشده است'
      : 'هنوز اعلانی در این دسته ثبت نشده است';

  return (
    <div className="p-4">
      <PageHeader
        icon={<FaBell />}
        title="اعلانات"
        subtitle={
          unreadCount > 0
            ? `${toPersianNumber(unreadCount)} اعلان ناخوانده برایتان ثبت شده است`
            : 'همه اعلان‌ها خوانده شده‌اند'
        }
        actions={
          <>
            <Button
              tone={unreadOnly ? 'primary' : 'neutral'}
              variant={unreadOnly ? 'solid' : 'outline'}
              onClick={() => setUnreadOnly((value) => !value)}
              aria-pressed={unreadOnly}
            >
              فقط ناخوانده‌ها
            </Button>
            <Button
              tone="primary"
              variant="outline"
              icon={<FaCheckDouble />}
              onClick={() => markAllRead()}
              disabled={unreadCount === 0 || isMarkingAll}
            >
              خواندن همه
            </Button>
          </>
        }
      />

      <div className="mb-4">
        <Segmented
          value={category}
          onChange={(value) => setCategory(value as CategoryFilter)}
          options={categoryTabs.map((tab) => ({
            value: tab.key,
            label: `${tab.label} (${toPersianNumber(countFor(tab.key))})`,
          }))}
        />
      </div>

      {isLoading ? (
        <LoadingState rows={6} label="در حال بارگذاری اعلان‌ها…" />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={() => refetch()} />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          icon={<FaInbox />}
          title={emptyMessage}
          hint="اعلان‌های سفارش، خوراکی و میز به‌صورت خودکار اینجا جمع می‌شوند."
        />
      ) : (
        <div className={`space-y-3 transition-opacity ${isMarking ? 'opacity-90' : ''}`}>
          {pagedNotifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onRead={markRead}
            />
          ))}
          <TablePager
            total={filteredNotifications.length}
            page={page}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};

export default Notifications;
