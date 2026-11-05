import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  } catch {
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

// گرفتن لیست رستوران‌ها
export interface Restaurant {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  phone?: string;
  address?: {
    city?: string;
    street?: string;
    buildingNumber?: number;
  };
  location?: {
    lat?: number;
    lng?: number;
  };
}

const fetchRestaurants = async (): Promise<Restaurant[]> => {
  const { data } = await customFetch.get('/customer/restaurants');
  return data.restaurants as Restaurant[];
};

export const useRestaurants = () => {
  const { data, isLoading, error, refetch } = useQuery<Restaurant[]>({
    queryKey: ['restaurants'],
    queryFn: fetchRestaurants,
    refetchOnWindowFocus: false,
    retry: false,
  });
  return { restaurants: data || [], isLoading, error, refetch };
};

// --- رزرو میز ---
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled';

export interface ReservationTable {
  _id: string;
  numeral: number;
  capacity: number;
  status: string;
  reservedSlots: string[];
}

export interface Reservation {
  _id: string;
  restaurant: { _id: string; name: string; address?: { city?: string } } | string;
  table: { _id: string; numeral: number; capacity: number } | string;
  customerName: string;
  customerPhone: string;
  guests: number;
  reserveAt: string;
  status: ReservationStatus;
}

export interface ReservationPayload {
  restaurant: string;
  table: number;
  guests: number;
  reserveAt: string;
  customerName: string;
  customerPhone: string;
}

const fetchReservationTables = async (restaurantId: string): Promise<ReservationTable[]> => {
  const { data } = await customFetch.get(`/customer/restaurants/${restaurantId}/tables`);
  return data.tables as ReservationTable[];
};

export const useReservationTables = (restaurantId?: string) => {
  const { data, isLoading, error } = useQuery<ReservationTable[]>({
    queryKey: ['reservationTables', restaurantId],
    queryFn: () => fetchReservationTables(restaurantId as string),
    enabled: !!restaurantId,
  });
  return { tables: data || [], isLoading, error };
};

export const useCreateReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: ReservationPayload) => {
      const { data } = await customFetch.post('/customer/reservations', payload);
      return data.reservation as Reservation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservationTables'] });
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
      showToast.success('میز با موفقیت رزرو شد');
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.msg || 'خطا در رزرو میز');
    },
  });
};

const fetchMyReservations = async (): Promise<Reservation[]> => {
  const { data } = await customFetch.get('/customer/reservations');
  return data.reservations as Reservation[];
};

export const useMyReservations = (enabled = true) => {
  const { data, isLoading, error, refetch } = useQuery<Reservation[]>({
    queryKey: ['myReservations'],
    queryFn: fetchMyReservations,
    enabled,
    retry: false,
  });
  return { reservations: data || [], isLoading, error, refetch };
};

export const useCancelReservation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (reservationId: string) => {
      const { data } = await customFetch.patch(`/customer/reservations/${reservationId}/cancel`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myReservations'] });
      queryClient.invalidateQueries({ queryKey: ['reservationTables'] });
      showToast.success('رزرو لغو شد');
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.msg || 'خطا در لغو رزرو');
    },
  });
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
