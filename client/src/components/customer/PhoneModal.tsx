import { useState, useEffect } from 'react';
import { Button, Modal } from '../dashboard/ui';
import { TextInput } from '../dashboard/inputs';

interface PhoneModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (phone: string) => void;
  error?: string;
  loading?: boolean;
}

const PhoneModal = ({ open, onClose, onSubmit, error, loading }: PhoneModalProps) => {
  const [phone, setPhone] = useState('');
  useEffect(() => {
    if (!open) setPhone('');
  }, [open]);
  if (!open) return null;

  const isValid = /^09\d{9}$/.test(phone);

  return (
    <Modal title="ورود با شماره موبایل" onClose={onClose}>
      <form
        className="space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (isValid && !loading) onSubmit(phone);
        }}
      >
        <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
          شماره موبایلت را وارد کن؛ کد تایید را پیامک می‌کنیم و می‌توانی سفارش‌ات را ثبت کنی.
        </p>
        <TextInput
          label="شماره موبایل"
          name="phone"
          type="tel"
          inputMode="numeric"
          dir="ltr"
          placeholder="09xxxxxxxxx"
          value={phone}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setPhone(event.target.value.replace(/\D/g, ''))
          }
          maxLength={11}
          autoFocus
          disabled={loading}
          error={error}
          hint="فقط ارقام؛ ۱۱ رقم با پیش‌شماره 09"
        />
        <div className="flex gap-2 pt-1">
          <Button type="button" tone="neutral" variant="outline" onClick={onClose} disabled={loading} className="flex-1">
            انصراف
          </Button>
          <Button type="submit" disabled={!isValid || loading} className="flex-1">
            {loading ? 'در حال ارسال…' : 'ادامه'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default PhoneModal;
