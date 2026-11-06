import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';
import { showToast } from '../utils/toast';

export type NotificationCategory = 'order' | 'edible' | 'table';
export type NotificationAction = 'create' | 'update' | 'delete' | 'reserve';

export interface AppNotification {
  _id: string;
  category?: NotificationCategory;
  action?: NotificationAction;
  // legacy field for notifications saved before categories were introduced
  type?: string;
  title: string;
  message: string;
  actorName?: string;
  isRead: boolean;
  createdAt: string;
}

export const getNotificationCategory = (notification: AppNotification): NotificationCategory =>
  notification.category ?? (notification.type === 'reservation' ? 'table' : 'order');

export interface NotificationsResult {
  notifications: AppNotification[];
  unreadCount: number;
}

const fetchNotifications = async (): Promise<NotificationsResult> => {
  const { data } = await customFetch.get('/notifications');
  return data;
};

export const useNotifications = () =>
  useQuery<NotificationsResult>({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    refetchInterval: 15000,
    refetchOnWindowFocus: true,
  });

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (notificationId: string) =>
      customFetch.patch(`/notifications/${notificationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: () => {
      showToast.error('خطا در به‌روزرسانی اعلان');
    },
  });
};

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => customFetch.patch('/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast.success('همه اعلان‌ها خوانده شدند');
    },
    onError: () => {
      showToast.error('خطا در به‌روزرسانی اعلان‌ها');
    },
  });
};
