import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBan, FaCalendarAlt, FaMapMarkerAlt, FaTable, FaUserFriends } from 'react-icons/fa';
import { useCustomerContext } from './customerlayout';
import {
  useCancelReservation,
  useMyReservations,
  type Reservation,
  type ReservationStatus,
} from '../../hooks/useCustomer';
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  Panel,
  Segmented,
} from '../../components/dashboard/ui';
import { statusTone } from '../../components/dashboard/tones';
import { formatJalaliDateTime } from '../../utils/geo';
import { toPersianNumber } from '../../utils/persianNumbers';
import { whenLabel } from '../../utils/reservationTiming';

const statusLabel: Record<ReservationStatus, string> = {
  pending: 'در انتظار تایید',
  confirmed: 'تایید شده',
  cancelled: 'لغو شده',
};

type StatusFilter = 'upcoming' | 'all';

const ReservationRow = ({
  reservation,
  onCancel,
  cancelling,
}: {
  reservation: Reservation;
  onCancel: (id: string) => void;
  cancelling: boolean;
}) => {
  const table = typeof reservation.table === 'object' ? reservation.table : undefined;
  const restaurant = typeof reservation.restaurant === 'object' ? reservation.restaurant : undefined;
  const isPast = new Date(reservation.reserveAt).getTime() < Date.now();
  const upcoming = whenLabel(reservation.reserveAt);

  return (
    <Panel className="animate-fade-up p-3 transition-shadow duration-200 hover:shadow-lift">
      <div className="flex flex-wrap items-center gap-3">
        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-card">
          <FaTable className="h-5 w-5" />
        </span>

        <div className="min-w-[190px] flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">
              {restaurant?.name || 'رستوران'}
            </h3>
            <Badge tone={statusTone(reservation.status)}>{statusLabel[reservation.status]}</Badge>
            {!isPast && reservation.status !== 'cancelled' && (
              <Badge tone={upcoming.tone}>{upcoming.text}</Badge>
            )}
          </div>
          <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <FaCalendarAlt className="h-3 w-3 text-gray-400" />
              {formatJalaliDateTime(reservation.reserveAt)}
            </span>
            <span className="flex items-center gap-1.5">
              <FaUserFriends className="h-3 w-3 text-gray-400" />
              میز {toPersianNumber(table?.numeral ?? 0)} · {toPersianNumber(reservation.guests)} نفر
            </span>
            {restaurant?.address?.city && (
              <span className="flex items-center gap-1.5">
                <FaMapMarkerAlt className="h-3 w-3 text-gray-400" />
                {restaurant.address.city}
              </span>
            )}
          </p>
        </div>

        <div className="ms-auto flex items-center gap-2">
          {restaurant?._id && (
            <Link
              to={`/restaurants/menu/${restaurant._id}/0`}
              className="rounded-xl border border-gray-200 px-3.5 py-2 text-sm font-bold text-gray-700 transition-colors hover:border-primary-300 hover:bg-primary-50/60 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-primary-500/10"
            >
              مشاهده منو
            </Link>
          )}
          {reservation.status !== 'cancelled' && !isPast && (
            <Button
              tone="danger"
              variant="outline"
              icon={<FaBan className="h-3 w-3" />}
              onClick={() => onCancel(reservation._id)}
              disabled={cancelling}
            >
              لغو
            </Button>
          )}
        </div>
      </div>
    </Panel>
  );
};

const MyReservations = () => {
  const { customer, updateUiState } = useCustomerContext();
  const { reservations, isLoading, error, refetch } = useMyReservations(!!customer);
  const cancelReservation = useCancelReservation();
  const [filter, setFilter] = useState<StatusFilter>('upcoming');

  const upcomingCount = useMemo(
    () =>
      reservations.filter((r) => r.status !== 'cancelled' && new Date(r.reserveAt).getTime() >= Date.now())
        .length,
    [reservations]
  );

  const list = useMemo(() => {
    const filtered =
      filter === 'upcoming'
        ? reservations.filter((r) => r.status !== 'cancelled' && new Date(r.reserveAt).getTime() >= Date.now())
        : reservations;
    return [...filtered].sort(
      (a, b) => new Date(a.reserveAt).getTime() - new Date(b.reserveAt).getTime()
    );
  }, [reservations, filter]);

  if (!customer) {
    return (
      <div className="min-h-screen bg-cream py-10 dark:bg-gray-900">
        <div className="container mx-auto px-3">
          <EmptyState
            icon={<FaTable />}
            title="برای دیدن رزروهای خود وارد شوید"
            hint="با شماره موبایل وارد می‌شوی؛ رزروهایت ثبت و قابل لغو می‌مانند."
            action={
              <Button onClick={() => updateUiState({ showPhoneModal: true })}>ورود یا ثبت‌نام</Button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream py-6 font-vazirmatn dark:bg-gray-900">
      <div className="container mx-auto max-w-3xl px-3">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-vazirmatn-title text-lg font-bold text-gray-800 dark:text-white">
              رزروهای من
            </h1>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {toPersianNumber(reservations.length)} رزرو · {toPersianNumber(upcomingCount)} پیش‌رو
            </p>
          </div>
          <Segmented
            value={filter}
            onChange={(value) => setFilter(value as StatusFilter)}
            options={[
              { value: 'upcoming', label: `پیش‌رو (${toPersianNumber(upcomingCount)})` },
              { value: 'all', label: `همه (${toPersianNumber(reservations.length)})` },
            ]}
          />
        </div>

        {isLoading ? (
          <LoadingState rows={4} label="در حال بارگذاری رزروها…" />
        ) : error ? (
          <ErrorState message="دریافت رزروها ممکن نشد." onRetry={refetch} />
        ) : list.length === 0 ? (
          <EmptyState
            icon={<FaCalendarAlt />}
            title={filter === 'upcoming' ? "رزرو پیش‌رویی نداری" : 'هنوز رزروی ثبت نشده است'}
            hint="یک رستوران انتخاب کن و میز امشبت را رزرو کن."
            action={
              <Link
                to="/restaurants"
                className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-card transition-colors hover:bg-primary-600"
              >
                مرور رستوران‌ها
              </Link>
            }
          />
        ) : (
          <div className="space-y-3">
            {list.map((reservation) => (
              <ReservationRow
                key={reservation._id}
                reservation={reservation}
                cancelling={cancelReservation.isPending}
                onCancel={(id) => cancelReservation.mutate(id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReservations;
