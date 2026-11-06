import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useDashboardContext } from './dashboard';
import { useStats } from '../../hooks/useStats';
import { toPersianNumber } from '../../utils/persianNumbers';
import { Badge, EmptyState, ErrorState, LoadingState, PageHeader, Panel } from '../../components/dashboard/ui';
import {
  FaArrowLeft,
  FaCalendarCheck,
  FaChartLine,
  FaClipboardCheck,
  FaInbox,
  FaShoppingCart,
  FaUsers,
} from 'react-icons/fa';
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
  Filler,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
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

const longDate = new Intl.DateTimeFormat('fa-IR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

const percentChange = (current: number, previous: number) => {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
};

/* نوارهای کوچک روند، بدون کتابخانه و فقط با ارتفاع‌های نسبی */
const Sparkline = ({ values, tone = 'primary' }: { values: number[]; tone?: 'primary' | 'emerald' }) => {
  const max = Math.max(...values, 1);
  const fill =
    tone === 'primary'
      ? 'from-primary-500/80 to-primary-300'
      : 'from-emerald-500/80 to-emerald-300';
  return (
    <div className="flex h-9 items-end gap-1">
      {values.map((value, index) => (
        <span
          key={index}
          title={toPersianNumber(Math.round(value).toLocaleString('en-US'))}
          className={`flex-1 rounded-t bg-gradient-to-t ${fill} transition-all duration-300`}
          style={{ height: `${Math.max(10, (value / max) * 100)}%` }}
        />
      ))}
    </div>
  );
};

const Overview = () => {
  const { isDarkTheme } = useDashboardContext();
  const { data: stats, isLoading, isError, error, refetch } = useStats();

  const ink = isDarkTheme ? 'rgb(229, 231, 235)' : 'rgb(71, 60, 48)';
  const grid = isDarkTheme ? 'rgba(255, 255, 255, 0.08)' : 'rgba(120, 90, 40, 0.08)';

  const axisTicks = {
    type: 'linear' as const,
    ticks: {
      color: ink,
      font: { family: 'Vazirmatn', size: 11 },
      callback: function (value: number | string): string {
        if (typeof value === 'number') return `${toPersianNumber((value / 1000000).toFixed(1))}م`;
        return '- م';
      },
    },
    grid: { color: grid },
  };

  const axisLabels = {
    ticks: { color: ink, font: { family: 'Vazirmatn', size: 11 } },
    grid: { color: grid },
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        rtl: true,
        textDirection: 'rtl' as const,
        backgroundColor: isDarkTheme ? 'rgba(17,24,39,.95)' : 'rgba(26,21,18,.92)',
        titleFont: { family: 'Vazirmatn', size: 12 },
        bodyFont: { family: 'Vazirmatn', size: 12 },
        padding: 10,
        callbacks: {
          label: (context: { parsed: { y: number } }) =>
            ` ${toPersianNumber(context.parsed.y.toLocaleString('en-US'))} تومان`,
        },
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
          borderColor: '#f5870a',
          backgroundColor: isDarkTheme ? 'rgba(245, 135, 10, 0.16)' : 'rgba(245, 135, 10, 0.14)',
          borderWidth: 2,
          pointRadius: 3,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#d96705',
          pointBorderWidth: 2,
          fill: true,
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
          backgroundColor: isDarkTheme ? 'rgba(16, 185, 129, 0.7)' : 'rgba(5, 150, 105, 0.75)',
          hoverBackgroundColor: '#059669',
          borderRadius: 8,
          borderSkipped: false as const,
          maxBarThickness: 26,
        },
      ],
    };
  }, [stats, isDarkTheme]);

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingState rows={5} label="در حال دریافت آمار رستوران…" />
      </div>
    );
  }

  if (isError || !stats) {
    return (
      <div className="p-4">
        <ErrorState message={error?.message} onRetry={() => void refetch()} />
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
      icon: <FaShoppingCart />,
      tone: 'primary' as const,
      change: revenueChange,
      spark: stats.daily.map((day) => day.revenue),
    },
    {
      title: 'سفارش‌های امروز',
      value: `${toPersianNumber(stats.todayOrders)} سفارش`,
      icon: <FaInbox />,
      tone: 'emerald' as const,
      change: ordersChange,
      spark: stats.daily.map((day) => day.orders),
    },
    {
      title: 'مشتریان جدید (۳۰ روز)',
      value: `${toPersianNumber(stats.newCustomers)} نفر`,
      icon: <FaUsers />,
      tone: 'primary' as const,
      change: null,
      spark: [],
    },
    {
      title: 'میانگین سفارش (۳۰ روز)',
      value: `${formatToman(stats.averageOrder)} تومان`,
      icon: <FaChartLine />,
      tone: 'emerald' as const,
      change: null,
      spark: [],
    },
  ];

  const live = [
    {
      label: 'رزروهای فعال',
      value: stats.activeReservations,
      icon: <FaCalendarCheck />,
      to: '/dashboard/reservations',
      action: 'مدیریت رزروها',
    },
    {
      label: 'سفارش‌های در انتظار',
      value: stats.pendingOrders,
      icon: <FaClipboardCheck />,
      to: '/dashboard/orders',
      action: 'بررسی سفارشات',
    },
  ];

  return (
    <div className="p-4">
      <PageHeader
        title="داشبورد"
        subtitle={longDate.format(new Date())}
        icon={<FaChartLine />}
        actions={
          <Badge tone="primary">
            {toPersianNumber(stats.daily.length)} روز اخیر پایش شده
          </Badge>
        }
      />

      {/* کارت‌های شاخص */}
      <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card, index) => (
          <Panel
            key={card.title}
            style={{ animationDelay: `${index * 70}ms` }}
            className="group relative animate-fade-up overflow-hidden p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <span
              className={`absolute -left-10 -top-10 h-24 w-24 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100 ${
                card.tone === 'primary' ? 'bg-primary-400/40' : 'bg-emerald-400/40'
              }`}
            />
            <div className="mb-3 flex items-start justify-between gap-2">
              <span
                className={`grid h-9 w-9 place-items-center rounded-xl [&>svg]:h-4 [&>svg]:w-4 ${
                  card.tone === 'primary'
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300'
                    : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300'
                }`}
              >
                {card.icon}
              </span>
              {card.change !== null && (
                <Badge tone={card.change >= 0 ? 'success' : 'danger'}>
                  {`${card.change >= 0 ? '▲' : '▼'} ${toPersianNumber(Math.abs(card.change).toFixed(0))}٪`}
                </Badge>
              )}
            </div>
            <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">{card.title}</p>
            <p className="mt-0.5 text-lg font-bold text-gray-900 font-vazirmatn-title dark:text-white">
              {card.value}
            </p>
            {card.spark.length > 0 && (
              <div className="mt-3">
                <Sparkline values={card.spark} tone={card.tone} />
              </div>
            )}
          </Panel>
        ))}
      </div>

      {/* وضعیت جاری */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {live.map((item, index) => (
          <Panel
            key={item.label}
            style={{ animationDelay: `${280 + index * 70}ms` }}
            className="flex animate-fade-up items-center gap-3 p-4"
          >
            <span className="relative grid h-11 w-11 place-items-center rounded-2xl bg-primary-50 text-primary-600 [&>svg]:h-4 [&>svg]:w-4 dark:bg-primary-500/15 dark:text-primary-300">
              {item.value > 0 && (
                <span className="absolute inset-0 animate-ping rounded-2xl bg-primary-400/30" />
              )}
              {item.icon}
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {toPersianNumber(item.value)}
              </p>
            </div>
            <Link
              to={item.to}
              className="flex items-center gap-1.5 rounded-xl bg-gray-50 px-3 py-2 text-xs font-bold text-primary-700 transition-all duration-200 hover:bg-primary-50 hover:gap-2.5 dark:bg-gray-900/50 dark:text-primary-300 dark:hover:bg-primary-500/15"
            >
              {item.action}
              <FaArrowLeft className="h-3 w-3" />
            </Link>
          </Panel>
        ))}
      </div>

      {/* نمودارها */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">فروش ۷ روز گذشته</h3>
            <Badge tone="primary">روند روزانه</Badge>
          </div>
          <div className="h-[300px]">
            {stats.daily.length > 0 ? (
              <Line data={lineChartData} options={chartOptions} />
            ) : (
              <EmptyState title="داده‌ای برای نمایش نیست" hint="هنوز سفارشی در بازه اخیر ثبت نشده است." />
            )}
          </div>
        </Panel>

        <Panel className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-bold text-gray-700 dark:text-gray-200">فروش ۱۲ ماه گذشته</h3>
            <Badge tone="success">روند ماهیانه</Badge>
          </div>
          <div className="h-[300px]">
            {stats.monthly.length > 0 ? (
              <Bar data={barChartData} options={chartOptions} />
            ) : (
              <EmptyState title="داده‌ای برای نمایش نیست" hint="هنوز سفارشی در بازه اخیر ثبت نشده است." />
            )}
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default Overview;
