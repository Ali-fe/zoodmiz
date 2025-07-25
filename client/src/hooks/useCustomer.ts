import { useQuery, useMutation } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';
import { showToast } from '../utils/toast';

export type Customer = {
  _id: string;
  name: string;
  lastName: string;
  phone: string;
};

const fetchCustomer = async (): Promise<Customer | null> => {
  try {
    const { data } = await customFetch.get('/customer/user');
    return data.user as Customer;
  } catch (err: any) {
    // if (err?.response?.data?.msg) showToast.error(err.response.data.msg);
    return null;
  }
};

export const useCustomer = () => {
  const { data, isLoading, error, refetch } = useQuery<Customer | null>({
    queryKey: ['customerUser'],
    queryFn: fetchCustomer,
    refetchOnWindowFocus: false,
    retry: false,
  });
  return { user: data, isLoading, error, refetch };
};

// هوک جدید برای گرفتن منوی عمومی
export interface MenuResult {
  menu: any[];
  resraurant: any;
}

const fetchMenu = async (restaurantId: string): Promise<MenuResult> => {
  const { data } = await customFetch.get(`/customer/menu/${restaurantId}`);
  return data;
};

export const useMenu = (restaurantId: string) => {
  const { data, isLoading, error, refetch } = useQuery<MenuResult>({
    queryKey: ['Menu', restaurantId],
    queryFn: () => fetchMenu(restaurantId),
    enabled: !!restaurantId,
  });
  return { menu: data?.menu || [], restaurant: data?.resraurant, isLoading, error, refetch };
};

// --- OTP & Login/Logout mutations ---
export const useRequestOtp = () =>
  useMutation({
    mutationFn: async (phone: string) => {
      const { data } = await customFetch.post('/customer/auth/request-otp', { phone });
      showToast.success('کد ارسال شد');
      return data as { isNew: boolean; customer?: Customer };
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.msg || 'خطا در ارسال کد');
    },
  });

export const useVerifyOtp = () =>
  useMutation({
    mutationFn: async (payload: { phone: string; code: string; name?: string; lastName?: string }) => {
      const { data } = await customFetch.post('/customer/auth/verify-otp', payload);
      showToast.success('ورود موفقیت‌آمیز بود');
      return data.user as Customer;
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.msg || 'کد اشتباه است');
    },
  });

export const useLogoutCustomer = () =>
  useMutation({
    mutationFn: async () => {
      const { data } = await customFetch.get('/customer/auth/logout');
      showToast.success('خروج موفقیت‌آمیز بود');
      return data;
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.msg || 'خطا در خروج');
    },
  });
