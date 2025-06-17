import { useDashboardContext } from './dashboard';
import { FaShoppingCart, FaMoneyBillWave, FaUsers, FaChartLine } from 'react-icons/fa';
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

const Overview = () => {
  const { isDarkTheme } = useDashboardContext();

  // Sample data for weekly chart
  const weeklyChartData = {
    labels: ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'],
    datasets: [
      {
        label: 'فروش روزانه',
        data: [1200000, 1900000, 1500000, 2100000, 1800000, 2500000, 2200000],
        borderColor: isDarkTheme ? 'rgb(96, 165, 250)' : 'rgb(59, 130, 246)',
        backgroundColor: isDarkTheme ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
      },
    ],
  };

  // Sample data for annual chart
  const annualChartData = {
    labels: ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'],
    datasets: [
      {
        label: 'فروش ماهیانه',
        data: [35000000, 42000000, 38000000, 45000000, 48000000, 52000000, 49000000, 55000000, 58000000, 62000000, 65000000, 70000000],
        backgroundColor: isDarkTheme ? 'rgba(16, 185, 129, 0.8)' : 'rgba(5, 150, 105, 0.8)',
        borderColor: isDarkTheme ? 'rgb(16, 185, 129)' : 'rgb(5, 150, 105)',
        borderWidth: 1,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkTheme ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)',
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        ticks: {
          color: isDarkTheme ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)',
          callback: function(value: number | string) : string{
            if (typeof value === 'number')
               return `${(value / 1000000).toFixed(1)}M`;
            return '- M';
          },
        },
        grid: {
          color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: isDarkTheme ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)',
        },
        grid: {
          color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: isDarkTheme ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)',
        },
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        ticks: {
          color: isDarkTheme ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)',
          callback: function(value: number | string) : string {
            if (typeof value === 'number')
              return `${(value / 1000000).toFixed(1)}M`;
            else return '- M';
          },
        },
        grid: {
          color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          color: isDarkTheme ? 'rgb(229, 231, 235)' : 'rgb(55, 65, 81)',
        },
        grid: {
          color: isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
      },
    },
  };

  const stats = [
    {
      title: 'فروش امروز',
      value: '۲,۵۰۰,۰۰۰',
      unit: 'تومان',
      icon: <FaShoppingCart className="w-5 h-5" />,
      change: '+۱۲٪',
      isPositive: true,
    },
    {
      title: 'سود خالص',
      value: '۸۵۰,۰۰۰',
      unit: 'تومان',
      icon: <FaMoneyBillWave className="w-5 h-5" />,
      change: '+۸٪',
      isPositive: true,
    },
    {
      title: 'مشتریان جدید',
      value: '۴۵',
      unit: 'نفر',
      icon: <FaUsers className="w-5 h-5" />,
      change: '+۱۵٪',
      isPositive: true,
    },
    {
      title: 'میانگین سفارش',
      value: '۵۵,۰۰۰',
      unit: 'تومان',
      icon: <FaChartLine className="w-5 h-5" />,
      change: '-۳٪',
      isPositive: false,
    },
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-bold mb-4 text-right">داشبورد</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-3 rounded-xl shadow-lg ${
              isDarkTheme ? 'bg-gray-800' : 'bg-white'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-lg ${
                isDarkTheme ? 'bg-blue-500/20' : 'bg-blue-100'
              }`}>
                {stat.icon}
              </div>
              <span className={`text-xs font-semibold ${
                stat.isPositive ? 'text-green-500' : 'text-red-500'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className={`text-xs font-semibold mb-1 ${
              isDarkTheme ? 'text-gray-200' : 'text-gray-700'
            }`}>
              {stat.title}
            </h3>
            <p className={`text-base font-bold ${
              isDarkTheme ? 'text-white' : 'text-gray-900'
            }`}>
              {stat.value} {stat.unit}
            </p>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Chart */}
        <div className={`p-4 rounded-xl shadow-lg ${
          isDarkTheme ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-sm font-semibold mb-4 text-right ${
            isDarkTheme ? 'text-gray-200' : 'text-gray-700'
          }`}>
            نمودار فروش هفتگی
          </h3>
          <div className="h-[300px]">
            <Line data={weeklyChartData} options={lineChartOptions} />
          </div>
        </div>

        {/* Annual Chart */}
        <div className={`p-4 rounded-xl shadow-lg ${
          isDarkTheme ? 'bg-gray-800' : 'bg-white'
        }`}>
          <h3 className={`text-sm font-semibold mb-4 text-right ${
            isDarkTheme ? 'text-gray-200' : 'text-gray-700'
          }`}>
            نمودار فروش سالیانه
          </h3>
          <div className="h-[300px]">
            <Bar data={annualChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;