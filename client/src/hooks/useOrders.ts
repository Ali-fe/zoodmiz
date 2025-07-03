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
  phone?: string;
  table: string;
  notes?: string;
  items: OrderItem[];
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