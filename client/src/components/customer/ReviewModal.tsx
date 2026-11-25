import { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { useRestaurantReviews, type Restaurant } from '../../hooks/useCustomer';
import { useCustomerContext } from '../../pages/customer/customerlayout';
import { toPersianNumber } from '../../utils/persianNumbers';
import { Modal } from '../dashboard/ui';

export default function ReviewModal({ restaurant, onClose }: { restaurant: Restaurant; onClose: () => void }) {
  const { reviews, summary, isLoading, save } = useRestaurantReviews(restaurant._id);
  const { customer, updateUiState } = useCustomerContext();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  return <Modal title={`نظر کاربران درباره ${restaurant.name}`} onClose={onClose} width="md">
    <div className="space-y-4">
      <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-sm dark:bg-amber-500/10">
        <FaStar className="text-amber-400" />
        <strong>{summary.count ? toPersianNumber(summary.average.toFixed(1)) : 'هنوز امتیازی ثبت نشده'}</strong>
        <span className="text-gray-500">({toPersianNumber(summary.count)} نظر)</span>
      </div>
      {customer ? <form className="space-y-3 rounded-xl border border-gray-100 p-3 dark:border-gray-700" onSubmit={(e) => {
        e.preventDefault(); save.mutate({ rating, comment }, { onSuccess: () => { setComment(''); } });
      }}>
        <p className="text-xs font-bold">امتیاز شما</p>
        <div className="flex gap-1" dir="ltr">{[1, 2, 3, 4, 5].map((star) => <button key={star} type="button" aria-label={`${star} ستاره`} onClick={() => setRating(star)} className="p-1"><FaStar className={star <= rating ? 'text-amber-400' : 'text-gray-300'} /></button>)}</div>
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} rows={3} placeholder="نظر خود را بنویسید (اختیاری)" className="w-full rounded-xl border border-gray-200 bg-white p-3 text-sm dark:border-gray-600 dark:bg-gray-900" />
        {save.isError && <p className="text-xs text-rose-600">ثبت نظر انجام نشد؛ دوباره تلاش کنید.</p>}
        <button disabled={save.isPending} className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-white disabled:opacity-50">{save.isPending ? 'در حال ثبت…' : 'ثبت امتیاز و نظر'}</button>
      </form> : <button onClick={() => { onClose(); updateUiState({ showPhoneModal: true }); }} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white">برای ثبت نظر وارد شوید</button>}
      <div className="max-h-64 space-y-3 overflow-auto">
        {isLoading ? <p className="py-4 text-center text-sm text-gray-500">در حال دریافت نظرها…</p> : reviews.length ? reviews.map((review) => <article key={review._id} className="rounded-xl bg-gray-50 p-3 dark:bg-gray-900/50">
          <div className="flex items-center justify-between text-xs"><strong>{review.customerName || 'کاربر'}</strong><span className="flex items-center gap-1 text-amber-500"><FaStar />{toPersianNumber(review.rating)}</span></div>
          {review.comment && <p className="mt-2 whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-300">{review.comment}</p>}
        </article>) : <p className="py-4 text-center text-sm text-gray-500">اولین نفری باشید که نظر می‌دهد.</p>}
      </div>
    </div>
  </Modal>;
}
