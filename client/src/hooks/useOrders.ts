import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';
import { showToast } from '../utils/toast';

export interface OrderItem {
  edible: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
}

export interface CreateOrderInput {
  customerName: string;
  customerPhone?: string;
  table: string;
  notes?: string;
  items: OrderItem[];
}

export interface UpdateOrderInput {
  customerName?: string;
  customerPhone?: string;
  table?: string;
  notes?: string;
  status?: string;
  items?: OrderItem[];
}

export interface Order extends CreateOrderInput {
  _id: string;
  status: string;
  createdAt: string;
}

export const useOrders = () =>
  useQuery<Order[]>({
    queryKey: ['orders'],
    queryFn: async () => {
      const { data } = await customFetch.get('/orders');
      return data.orders as Order[];
    },
  });

export const useGetOrder = (orderId: string) =>
  useQuery<Order>({
    queryKey: ['orders', orderId],
    queryFn: async () => {
      const { data } = await customFetch.get(`/orders/${orderId}`);
      return data.order as Order;
    },
    enabled: !!orderId,
  });

  export const useCreateOrder = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (order: CreateOrderInput) => customFetch.post('/orders', order),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        showToast.success('سفارش با موفقیت ثبت شد');
        if (onSuccessCallback) onSuccessCallback();
      },
      onError: () => {
        showToast.error('خطا در ثبت سفارش');
      },
    });
  };
  
  export const useUpdateOrder = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: Partial<CreateOrderInput> }) => 
        customFetch.patch(`/orders/${id}`, data),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        showToast.success('سفارش با موفقیت بروزرسانی شد');
        if (onSuccessCallback) onSuccessCallback();
      },
      onError: () => {
        showToast.error('خطا در بروزرسانی سفارش');
      },
    });
  };
  
  export const useDeleteOrder = (onSuccessCallback?: () => void) => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (orderId: string) => customFetch.delete(`/orders/${orderId}`),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        showToast.success('سفارش با موفقیت حذف شد');
        if (onSuccessCallback) onSuccessCallback();
      },
      onError: () => {
        showToast.error('خطا در حذف سفارش');
      },
    });
  };
  
