import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBan, FaCalendarAlt, FaSpinner, FaTable } from 'react-icons/fa';
import { useCustomerContext } from './customerlayout';
import { useCancelReservation, useMyReservations, type Reservation, type ReservationStatus } from '../../hooks/useCustomer';
import { formatJalaliDateTime } from '../../utils/geo';
import { toPersianNumber } from '../../utils/persianNumbers';

const statusStyles: Record<ReservationStatus, { label: string; className: string }> = {
    pending: { label: 'در انتظار تایید', className: 'bg-amber-100 text-amber-700' },
    confirmed: { label: 'تایید شده', className: 'bg-emerald-100 text-emerald-700' },
    cancelled: { label: 'لغو شده', className: 'bg-gray-100 text-gray-500' },
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
    const style = statusStyles[reservation.status];
    const isPast = new Date(reservation.reserveAt).getTime() < Date.now();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex flex-wrap items-center gap-4">
            <div className="w-11 h-11 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <FaTable />
            </div>
            <div className="flex-1 min-w-[180px]">
                <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-800">{restaurant?.name || 'رستوران'}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${style.className}`}>{style.label}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1 flex items-center gap-1.5">
                    <FaCalendarAlt className="text-xs text-gray-400" />
                    {formatJalaliDateTime(reservation.reserveAt)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    میز {toPersianNumber(table?.numeral ?? 0)} · {toPersianNumber(reservation.guests)} نفر
                    {restaurant?.address?.city ? ` · ${restaurant.address.city}` : ''}
                </p>
            </div>
            <div className="flex items-center gap-2">
                {restaurant?._id && (
                    <Link
                        to={`/restaurants/menu/${restaurant._id}/0`}
                        className="px-3 py-1.5 rounded-lg text-sm font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
                    >
                        مشاهده منو
                    </Link>
                )}
                {reservation.status !== 'cancelled' && !isPast && (
                    <button
                        onClick={() => onCancel(reservation._id)}
                        disabled={cancelling}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold text-red-600 border border-red-200 hover:bg-red-50 transition disabled:opacity-60"
                    >
                        <FaBan className="text-xs" />
                        لغو
                    </button>
                )}
            </div>
        </div>
    );
};

const MyReservations = () => {
    const { customer, updateUiState } = useCustomerContext();
    const { reservations, isLoading, error } = useMyReservations(!!customer);
    const cancelReservation = useCancelReservation();
    const [filter, setFilter] = useState<StatusFilter>('upcoming');

    if (!customer) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-gray-600 bg-gray-50">
                <FaTable className="text-4xl text-gray-300" />
                <p className="text-sm">برای دیدن رزروهای خود وارد شوید</p>
                <button
                    onClick={() => updateUiState({ showPhoneModal: true })}
                    className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition"
                >
                    ورود
                </button>
            </div>
        );
    }

    const now = Date.now();
    const list = filter === 'upcoming'
        ? reservations.filter((r) => r.status !== 'cancelled' && new Date(r.reserveAt).getTime() >= now)
        : reservations;

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto py-8 max-w-3xl">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h1 className="text-xl font-bold text-gray-800">رزروهای من</h1>
                    <div className="inline-flex rounded-lg overflow-hidden border border-gray-200 bg-white">
                        {(['upcoming', 'all'] as StatusFilter[]).map((key) => (
                            <button
                                key={key}
                                onClick={() => setFilter(key)}
                                className={`px-4 py-1.5 text-sm font-medium transition ${
                                    filter === key ? 'bg-amber-500 text-white' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                {key === 'upcoming' ? 'پیش‌رو' : 'همه'}
                            </button>
                        ))}
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-16">
                        <FaSpinner className="animate-spin text-3xl text-amber-500" />
                    </div>
                ) : error ? (
                    <p className="text-center text-red-500 py-8 text-sm">خطا در بارگذاری رزروها</p>
                ) : list.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                        <FaCalendarAlt className="text-4xl text-gray-300 mb-3" />
                        <p className="text-sm">رزروی ثبت نشده است</p>
                        <Link
                            to="/restaurants"
                            className="mt-4 px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition"
                        >
                            مرور رستوران‌ها
                        </Link>
                    </div>
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
