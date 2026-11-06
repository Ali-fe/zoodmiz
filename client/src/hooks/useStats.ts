import { useQuery } from '@tanstack/react-query';
import customFetch from '../utils/customFetch';

export interface DailyStat {
  date: string; // YYYY-MM-DD
  revenue: number;
  orders: number;
}

export interface MonthlyStat {
  month: string; // YYYY-MM
  revenue: number;
  orders: number;
}

export interface RestaurantStats {
  todayRevenue: number;
  todayOrders: number;
  averageOrder: number;
  newCustomers: number;
  activeReservations: number;
  pendingOrders: number;
  daily: DailyStat[];
  monthly: MonthlyStat[];
}

const fetchStats = async (): Promise<RestaurantStats> => {
  const { data } = await customFetch.get('/restaurants/stats');
  return data.stats as RestaurantStats;
};

export const useStats = () =>
  useQuery<RestaurantStats>({
    queryKey: ['restaurantStats'],
    queryFn: fetchStats,
    refetchOnWindowFocus: true,
  });
