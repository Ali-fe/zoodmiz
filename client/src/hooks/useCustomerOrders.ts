import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';
import { showToast } from '../utils/toast';

export interface CustomerOrderItem {
  edible: string;
  name: string;
  price: number;
  quantity: number;
  discount: number;
}

export interface CreateCustomerOrderInput {
  restaurant: string;
  customerName: string;
  customerPhone?: string;
  table: number;
  notes?: string;
  items: CustomerOrderItem[];
}

export interface CustomerOrder extends CreateCustomerOrderInput {
  _id: string;
  status: string;
  createdAt: string;
}

export const useCustomerOrders = () =>
  useQuery<CustomerOrder[]>({
    queryKey: ['customer-orders'],
    queryFn: async () => {
      const { data } = await customFetch.get('/customer/orders');
      return data.orders as CustomerOrder[];
    },
  });

export const useCreateCustomerOrder = (onSuccessCallback?: () => void) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (order: CreateCustomerOrderInput) => customFetch.post('/customer/orders', order),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-orders'] });
      showToast.success('سفارش با موفقیت ثبت شد');
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: () => {
      showToast.error('خطا در ثبت سفارش');
    },
  });
}; 