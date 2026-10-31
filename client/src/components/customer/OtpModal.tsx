import { FaSpinner } from 'react-icons/fa';

interface OtpModalProps {
  open: boolean;
  isNew: boolean | null;
  name: string;
  lastName: string;
  code: string;
  onChange: (fields: Partial<{ name: string; lastName: string; code: string }>) => void;
  onClose: () => void;
  onSubmit: () => void;
  error?: string;
  loading?: boolean;
  onResend?: () => void;
  secondsLeft: number;
  expired: boolean;
}

function toPersianDigits(num: number): string {
  return num
    .toString()
    .replace(/\d/g, (d) => String.fromCharCode(d.charCodeAt(0) + 1728));
}

const OtpModal = ({ open, isNew, name, lastName, code, onChange, onClose, onSubmit, error, loading, onResend, secondsLeft, expired }: OtpModalProps) => {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs mx-auto flex flex-col items-center">
        <h2 className="text-base font-bold mb-4 text-center">تایید شماره موبایل</h2>
        {isNew && (
          <>
            <input type="text" placeholder="نام" value={name} onChange={e => onChange({ name: e.target.value })} className="w-full px-1 py-0.5 text-base border rounded text-center focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2" disabled={loading} />
            <input type="text" placeholder="نام خانوادگی" value={lastName} onChange={e => onChange({ lastName: e.target.value })} className="w-full px-1 py-0.5 text-base border rounded text-center focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2" disabled={loading} />
          </>
        )}
        <input type="text" placeholder="کد پیامک" value={code} onChange={e => onChange({ code: e.target.value })} maxLength={5} className="w-full px-1 py-0.5 text-base border rounded text-center focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2" disabled={loading || expired} />
        <div className="flex items-center justify-between w-full mb-2">
          <span className="text-xs text-gray-500">
            {expired
              ? 'کد منقضی شده یا زمان آن به اتمام رسیده است'
              : `زمان باقی‌مانده: ${toPersianDigits(minutes)}:${toPersianDigits(seconds).padStart(2, '۰')}`}
          </span>
          {expired && (
            <button
              type="button"
              className="text-xs text-amber-600 font-bold hover:underline ml-2"
              onClick={onResend}
            >
              ارسال مجدد کد
            </button>
          )}
        </div>
        {error && <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>}
        <div className="flex gap-2 w-full mt-3">
          <button onClick={onClose} className="flex-1 p-1 text-sm rounded bg-gray-200 text-gray-700 font-bold" disabled={loading}>انصراف</button>
          <button
            onClick={onSubmit}
            disabled={loading || expired || (isNew ? (name.length < 2 || lastName.length < 2 || code.length !== 5) : code.length !== 5)}
            className="flex-1 p-1 text-sm rounded bg-amber-500 text-white font-bold disabled:opacity-50"
          >
            {loading ? <FaSpinner className="inline animate-spin mr-1" /> : null}
            تایید
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpModal; 