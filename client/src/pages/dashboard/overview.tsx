import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardContext } from './dashboard';
import { useStats } from '../../hooks/useStats';
import { toPersianNumber } from '../../utils/persianNumbers';
import { FaShoppingCart, FaUsers, FaChartLine, FaSpinner, FaCalendarCheck, FaInbox } from 'react-icons/fa';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const formatToman = (value: number) => toPersianNumber(value.toLocaleString('en-US'));

const parseDay = (key: string) => {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year, (month || 1) - 1, day || 1);
};

const parseMonth = (key: string) => {
  const [year, month] = key.split('-').map(Number);
  return new Date(year, (month || 1) - 1, 1);
};

const weekdayLabel = (key: string) =>
  new Intl.DateTimeFormat('fa-IR', { weekday: 'short' }).format(parseDay(key));

const monthLabel = (key: string) =>
  new Intl.DateTimeFormat('fa-IR', { month: 'long' }).format(parseMonth(key));

const percentChange = (current: number, previous: number) => {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
};

const Overview = () => {
  const { isDarkTheme } = useDashboardContext();
  const { data: stats, isLoading, isError, error } = useStats();

  const axisTicks = {
    type: 'linear' as const,
    ticks: {
      color: isDarkTheme ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)',
      callback: function (value: number | string): string {
        if (typeof value === 'number') return `${toPersianNumber((value / 1000000).toFixed(1))}م`;
        return '- م';
      },
    },
    grid: { color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
  };

  const axisLabels = {
    ticks: { color: isDarkTheme ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)' },
    grid: { color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' },
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: { color: isDarkTheme ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)' },
      },
    },
    scales: { y: axisTicks, x: axisLabels },
  };

  const lineChartData = useMemo(() => {
    const daily = stats?.daily ?? [];
    return {
      labels: daily.map((day) => weekdayLabel(day.date)),
      datasets: [
        {
          label: 'فروش روزانه',
          data: daily.map((day) => day.revenue),
          borderColor: isDarkTheme ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)',
          backgroundColor: isDarkTheme ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
        },
      ],
    };
  }, [stats, isDarkTheme]);

  const barChartData = useMemo(() => {
    const monthly = stats?.monthly ?? [];
    return {
      labels: monthly.map((month) => monthLabel(month.month)),
      datasets: [
        {
          label: 'فروش ماهیانه',
          data: monthly.map((month) => month.revenue),
          backgroundColor: isDarkTheme ? 'rgba(16, 185, 129, 0.8)' : 'rgba(5, 150, 105, 0.8)',
          borderColor: isDarkTheme ? 'rgb(16, 185, 129)' : 'rgb(5, 150, 105)',
          borderWidth: 1,
        },
      ],
    };
  }, [stats, isDarkTheme]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <FaSpinner className={`animate-spin text-3xl ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="p-4 text-center text-red-500">
        خطا در دریافت آمار رستوران{error ? `: ${error.message}` : ''}
      </div>
    );
  }

  const yesterday = stats.daily[stats.daily.length - 2];
  const revenueChange = percentChange(stats.todayRevenue, yesterday?.revenue ?? 0);
  const ordersChange = percentChange(stats.todayOrders, yesterday?.orders ?? 0);

  const cards = [
    {
      title: 'فروش امروز',
      value: `${formatToman(stats.todayRevenue)} تومان`,
      icon: <FaShoppingCart className="w-5 h-5" />,
      change: revenueChange,
    },
    {
      title: 'سفارش‌های امروز',
      value: `${toPersianNumber(stats.todayOrders)} سفارش`,
      icon: <FaInbox className="w-5 h-5" />,
      change: ordersChange,
    },
    {
      title: 'مشتریان جدید (۳۰ روز)',
      value: `${toPersianNumber(stats.newCustomers)} نفر`,
      icon: <FaUsers className="w-5 h-5" />,
      change: null,
    },
    {
      title: 'میانگین سفارش (۳۰ روز)',
      value: `${formatToman(stats.averageOrder)} تومان`,
      icon: <FaChartLine className="w-5 h-5" />,
      change: null,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4 text-right">داشبورد</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {cards.map((stat) => (
          <div
            key={stat.title}
            className={`p-3 rounded-xl shadow-lg ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-lg ${isDarkTheme ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                {stat.icon}
              </div>
              {stat.change !== null && (
                <span className={`text-xs font-semibold ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {`${stat.change >= 0 ? '+' : '−'}${toPersianNumber(Math.abs(stat.change).toFixed(0))}٪ نسبت به دیروز`}
                </span>
              )}
            </div>
            <h3 className={`text-xs font-semibold mb-1 ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
              {stat.title}
            </h3>
            <p className={`text-base font-bold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* وضعیت جاری */}
      <div
        className={`flex flex-wrap items-center gap-4 px-4 py-3 rounded-xl shadow-lg mb-6 text-sm ${
          isDarkTheme ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'
        }`}
      >
        <span className="flex items-center gap-2">
          <FaCalendarCheck className={isDarkTheme ? 'text-amber-400' : 'text-amber-500'} />
          رزروهای فعال: {toPersianNumber(stats.activeReservations)}
        </span>
        <span className="flex items-center gap-2">
          <FaInbox className={isDarkTheme ? 'text-blue-400' : 'text-blue-600'} />
          سفارش‌های در انتظار: {toPersianNumber(stats.pendingOrders)}
        </span>
        <Link
          to="/dashboard/reservations"
          className="mr-auto text-xs font-bold text-amber-600 hover:text-amber-700"
        >
          مدیریت رزروها
        </Link>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`p-4 rounded-xl shadow-lg ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-sm font-semibold mb-4 text-right ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
            فروش ۷ روز گذشته
          </h3>
          <div className="h-[300px]">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

        <div className={`p-4 rounded-xl shadow-lg ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
          <h3 className={`text-sm font-semibold mb-4 text-right ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
            فروش ۱۲ ماه گذشته
          </h3>
          <div className="h-[300px]">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
