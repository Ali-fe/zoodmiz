import { useMemo, useState } from "react";
import { FaCalendarCheck, FaMinus, FaPlus, FaUserClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  useCreateReservation,
  useReservationTables,
  type ReservationTable,
  type Restaurant,
} from "../../hooks/useCustomer";
import { useCustomerContext } from "../../pages/customer/customerlayout";
import { toPersianNumber } from "../../utils/persianNumbers";
import { Button, LoadingState, Modal } from "../dashboard/ui";
import { TextInput } from "../dashboard/inputs";

const RESERVATION_WINDOW_MS = 2 * 60 * 60 * 1000;
const DAY_COUNT = 14;

// بازه کاری رستوران‌ها: ۱۱:۰۰ تا ۲۳:۳۰ با گام ۳۰ دقیقه
const TIME_SLOTS = Array.from({ length: 26 }, (_, i) => {
  const minutes = 11 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

// برچسب تاریخ محلی؛ toISOString در ساعات اولیه شب روز قبل را می‌دهد
const isoDay = (offsetDays: number) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

// نزدیک‌ترین اسلات قابل رزرو از الان (با ۳۰ دقیقه تلورانس)
const defaultSlot = () => {
  const next = new Date(Date.now() + 30 * 60 * 1000);
  const minutes = next.getHours() * 60 + next.getMinutes();
  const slot = TIME_SLOTS.find((s) => {
    const [h, m] = s.split(":").map(Number);
    return h * 60 + m >= minutes;
  });
  // بعد از پایان سرویس همان روز، از اول‌ترین ساعت فرد
  return slot ? { date: isoDay(0), time: slot } : { date: isoDay(1), time: TIME_SLOTS[0] };
};

const isTableFree = (table: ReservationTable, at: Date) =>
  !table.reservedSlots.some(
    (slot) => Math.abs(new Date(slot).getTime() - at.getTime()) < RESERVATION_WINDOW_MS
  );

interface ReservationModalProps {
  restaurant: Restaurant;
  onClose: () => void;
}

const chipBase =
  "rounded-xl border px-3 py-2 text-xs font-bold transition-all duration-200 active:scale-[.97]";
const chipOff =
  "border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-50/60 dark:border-gray-600 dark:bg-gray-900/40 dark:text-gray-200 dark:hover:bg-primary-500/10";
const chipOn = "border-primary bg-primary text-white shadow-card";

const SectionLabel = ({ children, hint }: { children: React.ReactNode; hint?: string }) => (
  <div className="mb-2 flex items-baseline justify-between gap-2">
    <h3 className="text-xs font-bold text-gray-700 dark:text-gray-200">{children}</h3>
    {hint && <p className="text-[11px] text-gray-400">{hint}</p>}
  </div>
);

const ReservationModal = ({ restaurant, onClose }: ReservationModalProps) => {
  const { customer, updateUiState } = useCustomerContext();
  const { tables, isLoading: tablesLoading } = useReservationTables(restaurant._id);
  const createReservation = useCreateReservation();
  const accountName = [customer?.name, customer?.lastName].filter(Boolean).join(" ").trim();

  const [firstSlot] = useState(defaultSlot);
  const [date, setDate] = useState(firstSlot.date);
  const [time, setTime] = useState(firstSlot.time);
  const [guests, setGuests] = useState(2);
  const [name, setName] = useState(accountName);
  const [phone, setPhone] = useState(customer?.phone || "");
  const [tableNumeral, setTableNumeral] = useState<number | null>(null);
  const [confirmed, setConfirmed] = useState<{ numeral: number; reserveAt: string } | null>(null);

  const days = useMemo(
    () =>
      Array.from({ length: DAY_COUNT }, (_, index) => {
        const iso = isoDay(index);
        const dateObj = new Date(`${iso}T12:00:00`);
        return {
          iso,
          isToday: index === 0,
          weekday: new Intl.DateTimeFormat("fa-IR", { weekday: "short" }).format(dateObj),
          dayNum: new Intl.DateTimeFormat("fa-IR", { day: "numeric" }).format(dateObj),
        };
      }),
    []
  );

  const reserveAt = useMemo(() => new Date(`${date}T${time}:00`), [date, time]);
  const freeTables = useMemo(
    () => tables.filter((table) => table.capacity >= guests && isTableFree(table, reserveAt)),
    [tables, guests, reserveAt]
  );
  const selectedTable = freeTables.find((table) => table.numeral === tableNumeral);

  const isPastSlot = (slot: string) => new Date(`${date}T${slot}:00`).getTime() <= Date.now();

  const fullName = name.trim() || accountName;
  const phoneIsValid = /^0\d{10}$/.test(phone);
  const slotIsFuture = reserveAt.getTime() > Date.now();
  const canSubmit =
    !!customer &&
    !!selectedTable &&
    !!fullName &&
    phoneIsValid &&
    slotIsFuture &&
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
      <Modal title="ورود برای رزرو میز" onClose={onClose}>
        <div className="flex flex-col items-center gap-3 py-2 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300">
            <FaUserClock className="h-6 w-6" />
          </span>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">برای رزرو میز وارد شوید</p>
          <p className="max-w-[34ch] text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            با شماره موبایل خود وارد شوید تا رزروهای شما ثبت و قابل لغو باشند.
          </p>
          <Button
            className="mt-1 w-full"
            onClick={() => {
              onClose();
              updateUiState({ showPhoneModal: true });
            }}
          >
            ورود یا ثبت‌نام
          </Button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal title={`رزرو میز در ${restaurant.name}`} onClose={onClose} width="lg">
      {confirmed ? (
        <div className="flex animate-fade-up flex-col items-center gap-3 py-6 text-center">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
            <FaCalendarCheck className="h-7 w-7" />
          </span>
          <p className="text-sm font-bold text-gray-800 dark:text-gray-100">
            میز شماره {toPersianNumber(confirmed.numeral)} رزرو شد
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Intl.DateTimeFormat("fa-IR", { dateStyle: "full", timeStyle: "short" }).format(
              new Date(confirmed.reserveAt)
            )}
          </p>
          <p className="max-w-[40ch] text-[11px] leading-relaxed text-gray-400">
            پس از تایید رستوران، وضعیت رزرو را از بخش «رزروهای من» دنبال کنید.
          </p>
          <div className="mt-2 flex items-center gap-2">
            <Link
              to="/restaurants/reservations"
              onClick={onClose}
              className="rounded-xl bg-primary px-4 py-2 text-sm font-bold text-white shadow-card transition-colors hover:bg-primary-600"
            >
              رزروهای من
            </Link>
            <Button tone="neutral" variant="outline" onClick={onClose}>
              بستن
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <section>
            <SectionLabel hint="بازه رزرو هر میز ۲ ساعت است">روز</SectionLabel>
            <div className="flex gap-2 overflow-x-auto pb-1.5">
              {days.map((day) => (
                <button
                  key={day.iso}
                  type="button"
                  onClick={() => setDate(day.iso)}
                  className={`${chipBase} flex min-w-[3.6rem] shrink-0 flex-col items-center gap-0.5 ${
                    date === day.iso ? chipOn : chipOff
                  }`}
                >
                  <span className="text-[10px] font-normal opacity-80">
                    {day.isToday ? "امروز" : day.weekday}
                  </span>
                  <span className="text-sm font-bold">{day.dayNum}</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <SectionLabel hint={`${toPersianNumber(TIME_SLOTS.filter((slot) => !isPastSlot(slot)).length)} ساعت آزاد`}>
              ساعت
            </SectionLabel>
            <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  disabled={isPastSlot(slot)}
                  onClick={() => setTime(slot)}
                  className={`${chipBase} px-2.5 py-1.5 ${
                    time === slot && !isPastSlot(slot) ? chipOn : chipOff
                  } disabled:cursor-not-allowed disabled:opacity-35`}
                >
                  {toPersianNumber(slot)}
                </button>
              ))}
            </div>
          </section>

          <section className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gray-50 px-3 py-2.5 dark:bg-gray-900/40">
            <div>
              <p className="text-xs font-bold text-gray-700 dark:text-gray-200">تعداد نفرات</p>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">
                فقط میزهایی با ظرفیت مساوی یا بیشتر نمایش داده می‌شوند.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="کم کردن نفرات"
                onClick={() => setGuests((value) => Math.max(1, value - 1))}
                disabled={guests <= 1}
                className="grid h-8 w-8 place-items-center rounded-lg bg-white text-rose-600 shadow-sm transition-all hover:bg-rose-50 active:scale-95 disabled:opacity-40 dark:bg-gray-800 dark:text-rose-300"
              >
                <FaMinus className="h-3 w-3" />
              </button>
              <span className="min-w-[3ch] text-center text-sm font-bold text-gray-800 dark:text-white">
                {toPersianNumber(guests)}
              </span>
              <button
                type="button"
                aria-label="اضافه کردن نفرات"
                onClick={() => setGuests((value) => Math.min(30, value + 1))}
                disabled={guests >= 30}
                className="grid h-8 w-8 place-items-center rounded-lg bg-white text-emerald-600 shadow-sm transition-all hover:bg-emerald-50 active:scale-95 disabled:opacity-40 dark:bg-gray-800 dark:text-emerald-300"
              >
                <FaPlus className="h-3 w-3" />
              </button>
            </div>
          </section>

          <section>
            <SectionLabel hint={`${toPersianNumber(freeTables.length)} میز`}>میزهای آزاد</SectionLabel>
            {tablesLoading ? (
              <LoadingState rows={2} label="در حال دریافت میزها…" />
            ) : freeTables.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-gray-200 px-3 py-6 text-center text-xs leading-relaxed text-gray-500 dark:border-gray-700 dark:text-gray-400">
                در این ساعت میزی با این ظرفیت آزاد نیست.
                <br />
                ساعت، روز یا تعداد نفرات را تغییر دهید.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {freeTables.map((table) => (
                  <button
                    key={table._id}
                    type="button"
                    onClick={() => setTableNumeral(table.numeral)}
                    className={`${chipBase} flex items-center gap-1.5 ${
                      table.numeral === tableNumeral ? chipOn : chipOff
                    }`}
                  >
                    <span>میز {toPersianNumber(table.numeral)}</span>
                    <span className={`text-[11px] font-normal ${table.numeral === tableNumeral ? "text-white/85" : "text-gray-500 dark:text-gray-400"}`}>
                      {toPersianNumber(table.capacity)} نفره
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="grid gap-3 sm:grid-cols-2">
            <TextInput
              label="نام و نام خانوادگی"
              name="reservationName"
              value={name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setName(event.target.value)}
              placeholder="مثلاً سارا محمدی"
              error={fullName ? "" : "نام را وارد کنید"}
              disabled={createReservation.isPending}
            />
            <TextInput
              label="شماره موبایل"
              name="reservationPhone"
              type="tel"
              inputMode="numeric"
              dir="ltr"
              value={phone}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPhone(event.target.value.replace(/\D/g, "").slice(0, 11))
              }
              placeholder="09xxxxxxxxx"
              error={phoneIsValid ? "" : "شماره موبایل معتبر نیست"}
              disabled={createReservation.isPending}
            />
          </section>

          {!slotIsFuture && (
            <p className="rounded-xl border-e-4 border-rose-500 bg-rose-50/80 px-3 py-2 text-[11px] font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
              ساعت انتخابی گذشته است؛ روز یا ساعت دیگری انتخاب کنید.
            </p>
          )}

          {createReservation.isError ? (
            <p className="rounded-xl border-e-4 border-rose-500 bg-rose-50/80 px-3 py-2 text-[11px] font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
              ثبت رزرو انجام نشد؛ دوباره تلاش کنید.
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 dark:border-gray-700">
            <p className="text-[11px] text-gray-400">
              {selectedTable
                ? `میز ${toPersianNumber(selectedTable.numeral)} انتخاب شده · تا ${toPersianNumber(DAY_COUNT)} روز آینده`
                : "ابتدا یکی از میزهای آزاد را انتخاب کنید"}
            </p>
            <Button onClick={() => selectedTable && submit(selectedTable.numeral)} disabled={!canSubmit}>
              {createReservation.isPending ? "در حال ثبت…" : "ثبت رزرو"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ReservationModal;
