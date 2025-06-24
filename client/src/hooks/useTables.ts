import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';
import {Table} from '../types/table';
import { showToast } from '../utils/toast';


export const useTables = () => {
  return useQuery<Table[]>({
    queryKey: ['tables'],
    queryFn: async () => {
      const { data } = await customFetch.get('/restaurants/tables');
      return data.tables;
    },
  });
};

export const useCreateTable = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: { numeral: number; capacity: number }) =>
      customFetch.post('/restaurants/tables', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      showToast.success('میز جدید با موفقیت اضافه شد');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: () => {
      showToast.error('خطا در افزودن میز جدید');
    },
  });
}; 

export const useUpdateTable = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string, data: Partial<Omit<Table, '_id'>> }) =>
      customFetch.patch(`/restaurants/tables/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      showToast.success('میز با موفقیت به‌روزرسانی شد');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: () => {
      showToast.error('خطا در به‌روزرسانی میز');
    },
  });
};

export const useDeleteTable = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
      mutationFn: (tableId: string) => customFetch.delete(`/restaurants/tables/${tableId}`),
      onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['tables'] });
          showToast.success('میز با موفقیت حذف شد');
          if (onSuccessCallback) {
            onSuccessCallback();
        }
      },
      onError: () => {
          showToast.error('خطا در حذف میز');
          if (onSuccessCallback) {
            onSuccessCallback();
        }
      }
  });
}; 
