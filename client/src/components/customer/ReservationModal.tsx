import { useMemo, useState } from "react";
import { FaCalendarCheck, FaSpinner, FaTable, FaUserClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  useCreateReservation,
  useReservationTables,
  type ReservationTable,
  type Restaurant,
} from "../../hooks/useCustomer";
import { useCustomerContext } from "../../pages/customer/customerlayout";
import { toPersianNumber } from "../../utils/persianNumbers";

const RESERVATION_WINDOW_MS = 2 * 60 * 60 * 1000;

// بازده کاری رستوران‌ها: ۱۱:۰۰ تا ۲۳:۳۰ با گام ۳۰ دقیقه
const TIME_SLOTS = Array.from({ length: 26 }, (_, i) => {
  const minutes = 11 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

const isoDay = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

const isTableFree = (table: ReservationTable, at: Date) =>
  !table.reservedSlots.some(
    (slot) => Math.abs(new Date(slot).getTime() - at.getTime()) < RESERVATION_WINDOW_MS
  );

interface ReservationModalProps {
  restaurant: Restaurant;
  onClose: () => void;
}

const ReservationModal = ({ restaurant, onClose }: ReservationModalProps) => {
  const { customer, updateUiState } = useCustomerContext();
  const { tables, isLoading: tablesLoading } = useReservationTables(restaurant._id);
  const createReservation = useCreateReservation();

  const [date, setDate] = useState(isoDay(0));
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [tableNumeral, setTableNumeral] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState<{ numeral: number; reserveAt: string } | null>(null);

  const reserveAt = useMemo(() => new Date(`${date}T${time}:00`), [date, time]);
  const freeTables = useMemo(
    () => tables.filter((table) => table.capacity >= guests && isTableFree(table, reserveAt)),
    [tables, guests, reserveAt]
  );
  const selectedTable = freeTables.find((table) => table.numeral === tableNumeral);

  // با تغییر ساعت/تاریخ/نفرات انتخاب قبلی نامعتبر می‌شود
  const selectTable = (numeral: number | null) => {
    setTableNumeral(numeral);
  };

  const fullName = name.trim() || customer?.name || "";
  const canSubmit =
    !!customer &&
    !!selectedTable &&
    !!fullName &&
    /^0\d{10}$/.test(phone) &&
    reserveAt.getTime() > Date.now() &&
    !createReservation.isPending;

  const submit = (numeral: number) =>
    createReservation.mutate(
      {
        restaurant: restaurant._id,
        table: numeral,
        guests,
        reserveAt: reserveAt.toISOString(),
        customerName: fullName,
        customerPhone: phone,
      },
      { onSuccess: (reservation) => setConfirmed({ numeral, reserveAt: reservation.reserveAt }) }
    );

  if (!customer) {
    return (
      <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" dir="rtl">
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-lg p-5 text-center relative">
          <button onClick={onClose} className="absolute left-3 top-3 text-gray-400 hover:text-red-500 text-2xl">×</button>
          <FaUserClock className="mx-auto text-3xl text-amber-500 mb-3" />
          <h3 className="font-bold text-gray-800">برای رزرو میز وارد شوید</h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            با شماره موبایل خود وارد شوید تا رزروهای شما ثبت و قابل لغو باشند.
          </p>
          <button
            onClick={() => {
              onClose();
              updateUiState({ showPhoneModal: true });
            }}
            className="mt-4 w-full px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition"
          >
            ورود یا ثبت‌نام
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-2 md:p-4" dir="rtl">
      <div className="bg-white w-full md:max-w-xl max-h-[92vh] overflow-y-auto rounded-2xl shadow-lg p-4 relative">
        <button
          onClick={onClose}
          className="absolute left-4 top-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
        >
          ×
        </button>

        <div className="flex items-center gap-2 mb-4">
          <FaTable className="text-amber-500" />
          <h2 className="text-lg font-bold text-gray-800">رزرو میز در {restaurant.name}</h2>
        </div>

        {confirmed ? (
          <div className="text-center py-6">
            <FaCalendarCheck className="mx-auto text-4xl text-emerald-500 mb-3" />
            <p className="font-bold text-gray-800">میز شماره {toPersianNumber(confirmed.numeral)} رزرو شد</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Intl.DateTimeFormat("fa-IR", { dateStyle: "full", timeStyle: "short" }).format(new Date(confirmed.reserveAt))}
            </p>
            <p className="text-xs text-gray-400 mt-3">
              پس از تایید رستوران، وضعیت رزرو را از بخش «رزروهای من» دنبال کنید.
            </p>
            <div className="flex items-center justify-center gap-2 mt-5">
              <Link
                to="/restaurants/reservations"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition"
              >
                رزروهای من
              </Link>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition"
              >
                بستن
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="block">
                <span className="text-xs text-gray-500">تاریخ</span>
                <input
                  type="date"
                  value={date}
                  min={isoDay(0)}
                  max={isoDay(60)}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full h-10 px-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">ساعت</span>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-1 w-full h-10 px-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{toPersianNumber(slot)}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">تعداد نفرات</span>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="mt-1 w-full h-10 px-2 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </label>
            </div>

            <div>
              <span className="text-xs text-gray-500">میزهای آزاد</span>
              {tablesLoading ? (
                <div className="flex justify-center py-6">
                  <FaSpinner className="animate-spin text-2xl text-amber-500" />
                </div>
              ) : freeTables.length === 0 ? (
                <p className="mt-2 text-sm text-gray-500 bg-gray-50 rounded-lg p-3">
                  در این ساعت میزی با این ظرفیت آزاد نیست. ساعت، تاریخ یا تعداد نفرات را تغییر دهید.
                </p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  {freeTables.map((table) => (
                    <button
                      key={table._id}
                      type="button"
                      onClick={() => selectTable(table.numeral)}
                      className={`px-4 py-2 rounded-lg border text-sm transition ${
                        table.numeral === tableNumeral
                          ? "border-amber-500 bg-amber-500 text-white"
                          : "border-gray-200 bg-white hover:border-amber-500 hover:bg-amber-50 text-gray-700"
                      }`}
                    >
                      میز {toPersianNumber(table.numeral)}
                      <span className={`text-xs ${table.numeral === tableNumeral ? "text-amber-50" : "text-gray-500"}`}>
                        {" · "}{toPersianNumber(table.capacity)} نفره
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="block">
                <span className="text-xs text-gray-500">نام و نام خانوادگی</span>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full h-10 px-3 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </label>
              <label className="block">
                <span className="text-xs text-gray-500">شماره موبایل</span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1 w-full h-10 px-3 text-sm rounded-lg border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </label>
            </div>

            {reserveAt.getTime() <= Date.now() && (
              <p className="text-xs text-red-500">ساعت انتخابی گذشته است؛ تاریخ یا ساعت دیگری انتخاب کنید.</p>
            )}

            <div className="flex items-center justify-between gap-2 pt-1">
              <p className="text-xs text-gray-400">
                {selectedTable
                  ? `میز ${toPersianNumber(selectedTable.numeral)} انتخاب شده · بازه رزرو ۶۰ روز آینده`
                  : "ابتدا یکی از میزهای آزاد را انتخاب کنید"}
              </p>
              <button
                onClick={() => selectedTable && submit(selectedTable.numeral)}
                disabled={!canSubmit}
                className="px-5 py-2 rounded-lg bg-amber-500 text-white text-sm font-bold hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createReservation.isPending ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  "ثبت رزرو"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationModal;
