import { useEffect, useMemo, useState } from 'react';
import {
  FaCalendarCheck,
  FaCheck,
  FaClock,
  FaPhoneAlt,
  FaTable,
  FaTimes,
  FaUser,
  FaUsers,
} from 'react-icons/fa';
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  Panel,
  Segmented,
  TablePager,
} from '../../components/dashboard/ui';
import { statusTone } from '../../components/dashboard/tones';
import {
  useReservations,
  useUpdateReservationStatus,
  type Reservation,
} from '../../hooks/useReservations';
import { formatJalaliDateTime } from '../../utils/geo';
import { toPersianNumber } from '../../utils/persianNumbers';

type StatusFilter = 'all' | 'pending' | 'confirmed';

const statusLabel: Record<string, string> = {
  pending: 'در انتظار',
  confirmed: 'تایید شده',
  cancelled: 'لغو شده',
};

const PAGE_SIZE = 10;

const startOfDay = (value: number) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};

/** برچسب زمانی نزدیک‌ترین زمان به رزرو، برای اینکه مسئول بداند کدام مورد فوری است */
const whenLabel = (reserveAt: string) => {
  const diff = new Date(reserveAt).getTime() - Date.now();
  if (diff < 0) return { text: 'گذشته', tone: 'neutral' as const };

  const hours = Math.floor(diff / 3_600_000);
  const days = Math.round((startOfDay(new Date(reserveAt).getTime()) - startOfDay(Date.now())) / 86_400_000);

  if (hours < 1) return { text: 'کمتر از یک ساعت دیگر', tone: 'danger' as const };
  if (hours < 24 && days === 0) return { text: `${toPersianNumber(hours)} ساعت دیگر`, tone: 'warning' as const };
  if (days === 0) return { text: 'امروز', tone: 'danger' as const };
  if (days === 1) return { text: 'فردا', tone: 'warning' as const };
  if (days <= 7) return { text: `${toPersianNumber(days)} روز دیگر`, tone: 'info' as const };
  return { text: formatJalaliDateTime(reserveAt).split(' ')[0], tone: 'neutral' as const };
};

const ReservationCard = ({
  reservation,
  isBusy,
  onUpdate,
}: {
  reservation: Reservation;
  isBusy: boolean;
  onUpdate: (status: 'confirmed' | 'cancelled') => void;
}) => {
  const table = typeof reservation.table === 'object' ? reservation.table : undefined;
  const isPast = new Date(reservation.reserveAt).getTime() < Date.now();
  const upcoming = whenLabel(reservation.reserveAt);

  return (
    <Panel
      className={`animate-fade-up p-4 transition-shadow duration-200 hover:shadow-lift ${
        isPast ? 'opacity-70' : ''
      }`}
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-card">
          <FaTable className="h-4 w-4" />
        </div>

        <div className="min-w-[220px] flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-bold text-gray-800 dark:text-white">
              میز {toPersianNumber(table?.numeral ?? 0)} · {toPersianNumber(reservation.guests)} نفر
            </h3>
            <Badge tone={statusTone(reservation.status)}>{statusLabel[reservation.status] ?? reservation.status}</Badge>
            {!isPast && reservation.status === 'pending' && (
              <Badge tone={upcoming.tone}>
                <FaClock className="h-2.5 w-2.5" />
                {upcoming.text}
              </Badge>
            )}
          </div>

          <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-300">
            <span className="inline-flex items-center gap-1 font-vazirmatn-title">
              <FaCalendarCheck className="h-3 w-3 text-primary-500" />
              {formatJalaliDateTime(reservation.reserveAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <FaUser className="h-3 w-3 text-gray-400" />
              {reservation.customerName}
            </span>
            <span dir="ltr" className="inline-flex items-center gap-1">
              <FaPhoneAlt className="h-3 w-3 text-gray-400" />
              {toPersianNumber(reservation.customerPhone)}
            </span>
            {table?.capacity && (
              <span className="inline-flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <FaUsers className="h-3 w-3" />
                ظرفیت میز: {toPersianNumber(table.capacity)} نفر
              </span>
            )}
          </p>
        </div>

        {!isPast && reservation.status !== 'cancelled' && (
          <div className="flex items-center gap-2">
            {reservation.status === 'pending' && (
              <Button tone="success" icon={<FaCheck />} disabled={isBusy} onClick={() => onUpdate('confirmed')}>
                تایید
              </Button>
            )}
            <Button tone="danger" variant="outline" icon={<FaTimes />} disabled={isBusy} onClick={() => onUpdate('cancelled')}>
              رد
            </Button>
          </div>
        )}
      </div>
    </Panel>
  );
};

const Reservations = () => {
  const { data, isLoading, isError, error, refetch } = useReservations();
  const updateStatus = useUpdateReservationStatus();
  const [filter, setFilter] = useState<StatusFilter>('pending');
  const [upcomingOnly, setUpcomingOnly] = useState(true);
  const [page, setPage] = useState(0);

  const reservations = useMemo(() => data ?? [], [data]);

  const list = useMemo(() => {
    const now = Date.now();
    return reservations
      .filter((reservation) => {
        if (upcomingOnly && new Date(reservation.reserveAt).getTime() < now) return false;
        return filter === 'all' || reservation.status === filter;
      })
      .sort((a, b) => new Date(a.reserveAt).getTime() - new Date(b.reserveAt).getTime());
  }, [reservations, filter, upcomingOnly]);

  useEffect(() => {
    setPage(0);
  }, [filter, upcomingOnly]);

  const pagedList = useMemo(
    () => list.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [list, page]
  );

  const countFor = (key: StatusFilter) =>
    key === 'all' ? reservations.length : reservations.filter((r) => r.status === key).length;

  const pendingCount = countFor('pending');

  return (
    <div className="p-4">
      <PageHeader
        icon={<FaCalendarCheck />}
        title="رزرو میزها"
        subtitle={
          isLoading
            ? 'در حال خواندن رزروها…'
            : pendingCount > 0
              ? `${toPersianNumber(pendingCount)} رزرو در انتظار تصمیم شماست`
              : 'همه رزروها رسیدگی شده‌اند'
        }
        actions={
          <button
            type="button"
            onClick={() => setUpcomingOnly((value) => !value)}
            aria-pressed={upcomingOnly}
            className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all duration-200 active:scale-[.97] ${
              upcomingOnly
                ? 'bg-primary text-white shadow-card'
                : 'border border-gray-200 text-gray-600 hover:border-primary-300 hover:text-primary-600 dark:border-gray-600 dark:text-gray-300'
            }`}
          >
            <FaClock className="h-3 w-3" />
            فقط پیش‌رو
          </button>
        }
      />

      <div className="mb-4">
        <Segmented
          value={filter}
          onChange={(value) => setFilter(value as StatusFilter)}
          options={(
            [
              { key: 'pending', label: 'در انتظار' },
              { key: 'confirmed', label: 'تایید شده' },
              { key: 'all', label: 'همه' },
            ] as { key: StatusFilter; label: string }[]
          ).map((tab) => ({
            value: tab.key,
            label: `${tab.label} (${toPersianNumber(countFor(tab.key))})`,
          }))}
        />
      </div>

      {isLoading ? (
        <LoadingState rows={5} label="در حال بارگذاری رزروها…" />
      ) : isError ? (
        <ErrorState message={(error as Error)?.message} onRetry={() => refetch()} />
      ) : list.length === 0 ? (
        <EmptyState
          icon={<FaTable />}
          title="رزرو فعالی در این دسته وجود ندارد"
          hint={
            upcomingOnly
              ? 'با خاموش کردن «فقط پیش‌رو» می‌توانید رزروهای گذشته را هم ببینید.'
              : 'به‌زودی اولین رزرو شما اینجا ظاهر می‌شود.'
          }
        />
      ) : (
        <div className="space-y-3">
          {pagedList.map((reservation) => (
            <ReservationCard
              key={reservation._id}
              reservation={reservation}
              isBusy={updateStatus.isPending}
              onUpdate={(status) =>
                updateStatus.mutate(
                  { reservationId: reservation._id, status },
                  { onSuccess: () => status === 'confirmed' && setFilter('confirmed') }
                )
              }
            />
          ))}
          <TablePager total={list.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      )}
    </div>
  );
};

export default Reservations;
