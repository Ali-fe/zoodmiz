import { useState, useEffect } from 'react';
import { FaSpinner } from 'react-icons/fa';

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
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs mx-auto flex flex-col items-center">
        <h2 className="text-base font-bold mb-4 text-center">ورود کاربر</h2>
        <input
          type="tel"
          placeholder="شماره موبایل"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          className="w-full px-1 py-0.5 text-base border rounded text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
          maxLength={11}
          autoFocus
          disabled={loading}
        />
        {error && <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>}
        <div className="flex gap-2 w-full mt-3">
          <button onClick={onClose} className="flex-1 p-1 text-sm rounded bg-gray-200 text-gray-700 font-bold" disabled={loading}>انصراف</button>
          <button
            onClick={() => onSubmit(phone)}
            disabled={!/^09\d{9}$/.test(phone) || loading}
            className="flex-1 p-1 text-sm rounded bg-amber-500 text-white font-bold disabled:opacity-50"
          >
            {loading ? <FaSpinner className="inline animate-spin mr-1" /> : null}
            ادامه
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneModal; 