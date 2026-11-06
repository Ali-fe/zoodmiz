import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';
import { showToast } from '../utils/toast';
import type { Reservation, ReservationStatus } from './useCustomer';

export type { Reservation, ReservationStatus };

const fetchReservations = async (): Promise<Reservation[]> => {
  const { data } = await customFetch.get('/reservations');
  return data.reservations as Reservation[];
};

export const useReservations = () =>
  useQuery<Reservation[]>({
    queryKey: ['dashboardReservations'],
    queryFn: fetchReservations,
    refetchInterval: 30000,
  });

export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { reservationId: string; status: Extract<ReservationStatus, 'confirmed' | 'cancelled'> }) => {
      const { data } = await customFetch.patch(`/reservations/${payload.reservationId}`, { status: payload.status });
      return data;
    },
    onSuccess: (_, payload) => {
      queryClient.invalidateQueries({ queryKey: ['dashboardReservations'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      showToast.success(payload.status === 'confirmed' ? 'رزرو تایید شد' : 'رزرو رد شد');
    },
    onError: (err: any) => {
      showToast.error(err?.response?.data?.msg || 'خطا در به‌روزرسانی رزرو');
    },
  });
};
