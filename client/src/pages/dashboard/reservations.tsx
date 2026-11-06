import { useMemo, useState } from 'react';
import { FaCalendarCheck, FaCheck, FaTimes, FaSpinner, FaTable, FaUser } from 'react-icons/fa';
import { useDashboardContext } from './dashboard';
import {
  useReservations,
  useUpdateReservationStatus,
  type Reservation,
} from '../../hooks/useReservations';
import { formatJalaliDateTime } from '../../utils/geo';
import { toPersianNumber } from '../../utils/persianNumbers';

type StatusFilter = 'all' | 'pending' | 'confirmed';

const statusBadge: Record<string, { label: string; light: string; dark: string }> = {
  pending: { label: 'در انتظار', light: 'bg-amber-100 text-amber-700', dark: 'bg-amber-500/20 text-amber-400' },
  confirmed: { label: 'تایید شده', light: 'bg-emerald-100 text-emerald-700', dark: 'bg-emerald-500/20 text-emerald-400' },
  cancelled: { label: 'لغو شده', light: 'bg-gray-100 text-gray-500', dark: 'bg-gray-700 text-gray-400' },
};

const ReservationCard = ({
  reservation,
  isDarkTheme,
  isBusy,
  onUpdate,
}: {
  reservation: Reservation;
  isDarkTheme: boolean;
  isBusy: boolean;
  onUpdate: (status: 'confirmed' | 'cancelled') => void;
}) => {
  const table = typeof reservation.table === 'object' ? reservation.table : undefined;
  const badge = statusBadge[reservation.status] || statusBadge.pending;
  const isPast = new Date(reservation.reserveAt).getTime() < Date.now();

  return (
    <div
      className={`rounded-lg shadow-sm border p-4 flex flex-wrap items-center gap-4 transition-colors ${
        isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      } ${isPast ? 'opacity-70' : ''}`}
    >
      <div
        className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
          isDarkTheme ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
        }`}
      >
        <FaTable />
      </div>

      <div className="flex-1 min-w-[200px]">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={`text-sm font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
            میز {toPersianNumber(table?.numeral ?? 0)} · {toPersianNumber(reservation.guests)} نفر
          </h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full font-bold ${
              isDarkTheme ? badge.dark : badge.light
            }`}
          >
            {badge.label}
          </span>
        </div>
        <p className={`text-sm mt-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
          {formatJalaliDateTime(reservation.reserveAt)}
        </p>
        <p
          className={`text-xs mt-1.5 flex items-center gap-2 flex-wrap ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          <span className="flex items-center gap-1">
            <FaUser className="text-[10px]" />
            {reservation.customerName}
          </span>
          <span dir="ltr">{toPersianNumber(reservation.customerPhone)}</span>
          {table?.capacity && (
            <span>ظرفیت میز: {toPersianNumber(table.capacity)} نفر</span>
          )}
        </p>
      </div>

      {!isPast && reservation.status !== 'cancelled' && (
        <div className="flex items-center gap-2">
          {reservation.status === 'pending' && (
            <button
              onClick={() => onUpdate('confirmed')}
              disabled={isBusy}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-white transition disabled:opacity-60 ${
                isDarkTheme ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-emerald-500 hover:bg-emerald-600'
              }`}
            >
              <FaCheck className="text-xs" />
              تایید
            </button>
          )}
          <button
            onClick={() => onUpdate('cancelled')}
            disabled={isBusy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium text-white transition disabled:opacity-60 ${
              isDarkTheme ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            <FaTimes className="text-xs" />
            رد
          </button>
        </div>
      )}
    </div>
  );
};

const Reservations = () => {
  const { isDarkTheme } = useDashboardContext();
  const { data, isLoading, isError, error } = useReservations();
  const updateStatus = useUpdateReservationStatus();
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const [upcomingOnly, setUpcomingOnly] = useState(true);

  const reservations = useMemo(() => data ?? [], [data]);
  const list = useMemo(() => {
    const now = Date.now();
    return reservations.filter((reservation) => {
      if (upcomingOnly && new Date(reservation.reserveAt).getTime() < now) return false;
      return filter === 'all' || reservation.status === filter;
    });
  }, [reservations, filter, upcomingOnly]);

  const countFor = (key: StatusFilter) =>
    key === 'all'
      ? reservations.length
      : reservations.filter((r) => r.status === key).length;

  const tabClass = (key: StatusFilter) =>
    `px-3 py-1.5 text-sm font-medium transition-colors ${
      filter === key
        ? isDarkTheme
          ? 'bg-blue-600 text-white'
          : 'bg-blue-500 text-white'
        : isDarkTheme
          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
          : 'bg-white text-gray-700 hover:bg-gray-100'
    }`;

  return (
    <div className={`p-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex items-center gap-3 mb-6">
        <FaCalendarCheck className={isDarkTheme ? 'text-amber-400' : 'text-amber-500'} />
        <h1 className={`text-l font-bold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>رزرو میزها</h1>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <div
          className={`inline-flex rounded-md overflow-hidden border ${
            isDarkTheme ? 'border-gray-700' : 'border-gray-300'
          }`}
        >
          {(['pending', 'confirmed', 'all'] as StatusFilter[]).map((key) => (
            <button key={key} onClick={() => setFilter(key)} className={tabClass(key)}>
              {key === 'pending' ? 'در انتظار' : key === 'confirmed' ? 'تایید شده' : 'همه'}
              {` (${toPersianNumber(countFor(key))})`}
            </button>
          ))}
        </div>
        <button
          onClick={() => setUpcomingOnly((value) => !value)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md border transition-colors ${
            upcomingOnly
              ? 'bg-blue-500 border-blue-500 text-white'
              : isDarkTheme
                ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-100'
          }`}
        >
          فقط پیش‌رو
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <FaSpinner
            className={`animate-spin text-3xl ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`}
          />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-4">
          خطا در بارگذاری رزروها: {(error as Error)?.message}
        </div>
      ) : list.length === 0 ? (
        <div
          className={`flex flex-col items-center justify-center py-16 ${
            isDarkTheme ? 'text-gray-400' : 'text-gray-500'
          }`}
        >
          <FaTable className="text-4xl mb-3" />
          <p>رزرو فعالی در این دسته وجود ندارد</p>
        </div>
      ) : (
        <div className="space-y-3">
          {list.map((reservation) => (
            <ReservationCard
              key={reservation._id}
              reservation={reservation}
              isDarkTheme={isDarkTheme}
              isBusy={updateStatus.isPending}
              onUpdate={(status) =>
                updateStatus.mutate(
                  { reservationId: reservation._id, status },
                  { onSuccess: () => status === 'confirmed' && setFilter('confirmed') }
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;
