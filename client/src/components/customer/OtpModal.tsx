import { FaRedo } from 'react-icons/fa';
import { Button, Modal } from '../dashboard/ui';
import { TextInput } from '../dashboard/inputs';
import { toPersianNumber } from '../../utils/persianNumbers';

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

const TOTAL_SECONDS = 120;

const OtpModal = ({
  open,
  isNew,
  name,
  lastName,
  code,
  onChange,
  onClose,
  onSubmit,
  error,
  loading,
  onResend,
  secondsLeft,
  expired,
}: OtpModalProps) => {
  if (!open) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const canSubmit =
    code.length === 5 &&
    (!isNew || (name.trim().length >= 2 && lastName.trim().length >= 2));

  return (
    <Modal title={isNew ? 'ساخت حساب و تایید شماره' : 'تایید شماره موبایل'} onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (canSubmit && !loading && !expired) onSubmit();
        }}
      >
        {isNew && (
          <div className="grid grid-cols-2 gap-2">
            <TextInput
              label="نام"
              name="name"
              value={name}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange({ name: event.target.value })}
              placeholder="نام"
              disabled={loading}
              error=""
              hint=""
            />
            <TextInput
              label="نام خانوادگی"
              name="lastName"
              value={lastName}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange({ lastName: event.target.value })}
              placeholder="نام خانوادگی"
              disabled={loading}
              error=""
              hint=""
            />
          </div>
        )}

        <TextInput
          label="کد ۵ رقمی"
          name="code"
          type="tel"
          inputMode="numeric"
          dir="ltr"
          placeholder="•••••"
          value={code}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            onChange({ code: event.target.value.replace(/\D/g, '').slice(0, 5) })
          }
          maxLength={5}
          autoFocus
          disabled={loading || expired}
          error={error}
          hint="کد پیامک‌شده را وارد کن"
        />

        <div className="rounded-xl bg-gray-50 px-3 py-2.5 dark:bg-gray-900/40">
          <div className="flex items-center justify-between gap-2">
            <p className="text-[11px] font-bold text-gray-600 dark:text-gray-300">
              {expired
                ? 'زمان این کد تمام شده است.'
                : `باقی‌مانده: ${toPersianNumber(`${minutes}:${String(seconds).padStart(2, '0')}`)}`}
            </p>
            {expired && onResend ? (
              <Button type="button" tone="primary" variant="ghost" icon={<FaRedo className="h-3 w-3" />} onClick={onResend}>
                ارسال دوباره
              </Button>
            ) : null}
          </div>
          {!expired && (
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${
                  secondsLeft > 30 ? 'bg-primary' : 'bg-rose-500'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, (secondsLeft / TOTAL_SECONDS) * 100))}%` }}
              />
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <Button type="button" tone="neutral" variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            انصراف
          </Button>
          <Button type="submit" disabled={!canSubmit || loading || expired} className="flex-1">
            {loading ? 'در حال تایید…' : 'تایید'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default OtpModal;
