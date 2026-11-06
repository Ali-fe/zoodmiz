import Edible from '../types/edible';
import { FaMinus, FaPlus, FaShoppingBasket, FaTrash } from 'react-icons/fa';
import CoverArt from './coverart';
import { toPersianNumber } from '../utils/persianNumbers';

interface CartItem extends Edible {
  quantity: number;
}

interface CartProps {
  cart: CartItem[];
  cartSummary: { totalOriginalPrice: number; totalDiscount: number };
  handleAddToCart: (item: Edible) => void;
  handleUpdateQuantity: (itemId: string, amount: number) => void;
  handleClearCart: () => void;
  isDarkTheme?: boolean;
  notesInput: string;
  setNotesInput: (val: string) => void;
  onSubmitOrder: () => void;
  isModal?: boolean;
}

const Cart = ({
  cart,
  cartSummary,
  handleAddToCart,
  handleUpdateQuantity,
  handleClearCart,
  notesInput,
  setNotesInput,
  onSubmitOrder,
  isModal,
}: CartProps) => {
  const payable = cartSummary.totalOriginalPrice - cartSummary.totalDiscount;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const shellClass =
    'flex h-full flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-card dark:border-gray-700 dark:bg-gray-800';

  if (cart.length === 0) {
    return (
      <div className={isModal ? '' : 'hidden self-start sticky top-0 h-full lg:block'}>
        <div className={`${shellClass} items-center justify-center gap-3 p-8 text-center`}>
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary-50 text-primary-500 dark:bg-primary-500/15 dark:text-primary-300">
            <FaShoppingBasket className="h-6 w-6" />
          </span>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-200">سبد خرید هنوز خالی است</p>
          <p className="max-w-[220px] text-xs leading-relaxed text-gray-500 dark:text-gray-400">
            از فهرست غذاها چیزی انتخاب کنید؛ جمع قیمت و تخفیف همین‌جا محاسبه می‌شود.
          </p>
        </div>
      </div>
    );
  }

  const stepButton =
    'grid h-6 w-6 place-items-center rounded-md transition-colors active:scale-90 [&>svg]:h-2.5 [&>svg]:w-2.5';

  return (
    <div className={isModal ? '' : 'hidden self-start sticky top-0 h-full lg:block'}>
      <div className={shellClass}>
        <div className="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-3 dark:border-gray-700">
          <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-white">
            <FaShoppingBasket className="h-3.5 w-3.5 text-primary-500" />
            سبد خرید
          </h2>
          <div className="flex items-center gap-1.5">
            <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-bold text-primary-700 dark:bg-primary-500/15 dark:text-primary-200">
              {toPersianNumber(itemCount)} قلم
            </span>
            <button
              type="button"
              onClick={handleClearCart}
              title="خالی کردن سبد"
              aria-label="خالی کردن سبد"
              className="grid h-7 w-7 place-items-center rounded-lg text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/15 dark:hover:text-rose-300 [&>svg]:h-3 [&>svg]:w-3"
            >
              <FaTrash />
            </button>
          </div>
        </div>

        <ul className="max-h-80 flex-1 divide-y divide-gray-50 overflow-y-auto px-3 dark:divide-gray-700/60">
          {cart.map((item) => {
            const unit = Math.round(item.price * (1 - item.discount / 100));
            return (
              <li key={item._id} className="flex items-center gap-2.5 py-2.5">
                <CoverArt
                  name={item.name}
                  src={item.imageURL}
                  className="h-10 w-10 shrink-0 rounded-lg"
                  textClass="text-sm"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-gray-800 dark:text-gray-100">{item.name}</p>
                  <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                    {toPersianNumber(unit.toLocaleString())} تومان
                    {item.discount > 0 && (
                      <span className="ms-1 text-emerald-600 dark:text-emerald-400">
                        ({toPersianNumber(item.discount)}٪ تخفیف)
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-gray-50 p-0.5 dark:bg-gray-900/50">
                  <button
                    type="button"
                    onClick={() => handleUpdateQuantity(item._id, -1)}
                    aria-label="کاهش تعداد"
                    className={`${stepButton} bg-white text-rose-600 shadow-sm hover:bg-rose-50 dark:bg-gray-800 dark:text-rose-300`}
                  >
                    <FaMinus />
                  </button>
                  <span className="min-w-[22px] text-center text-xs font-bold text-gray-800 dark:text-gray-100">
                    {toPersianNumber(item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(item)}
                    aria-label="افزایش تعداد"
                    className={`${stepButton} bg-white text-emerald-600 shadow-sm hover:bg-emerald-50 dark:bg-gray-800 dark:text-emerald-300`}
                  >
                    <FaPlus />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="space-y-1.5 border-t border-gray-100 px-4 py-3 text-xs dark:border-gray-700">
          <div className="flex justify-between text-gray-500 dark:text-gray-400">
            <span>جمع کل</span>
            <span>{toPersianNumber(cartSummary.totalOriginalPrice.toLocaleString())} تومان</span>
          </div>
          {cartSummary.totalDiscount > 0 && (
            <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
              <span>سود شما از تخفیف</span>
              <span dir="ltr">- {toPersianNumber(cartSummary.totalDiscount.toLocaleString())} تومان</span>
            </div>
          )}
          <div className="flex items-baseline justify-between rounded-xl bg-primary-50 px-3 py-2 dark:bg-primary-500/10">
            <span className="text-xs font-bold text-primary-800 dark:text-primary-200">قابل پرداخت</span>
            <span className="text-sm font-bold text-primary-800 dark:text-primary-100">
              {toPersianNumber(payable.toLocaleString())}
              <span className="ms-1 text-[11px] font-normal">تومان</span>
            </span>
          </div>
        </div>

        <div className="space-y-3 border-t border-gray-100 px-4 py-3 dark:border-gray-700">
          <label htmlFor="order-notes" className="block text-[11px] font-bold text-gray-600 dark:text-gray-300">
            توضیحات سفارش
          </label>
          <textarea
            id="order-notes"
            rows={2}
            placeholder="مثلاً: سس اضافه لطفاً…"
            className="w-full resize-y rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-xs text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-900/50 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-primary-500/30"
            value={notesInput}
            onChange={(event) => setNotesInput(event.target.value)}
          />
          <button
            type="button"
            onClick={onSubmitOrder}
            className="w-full rounded-xl bg-gradient-to-l from-primary-500 to-primary-600 py-2.5 text-sm font-bold text-white shadow-card transition-all duration-200 hover:from-primary-600 hover:to-primary-700 active:scale-[.98]"
          >
            ثبت سفارش
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
