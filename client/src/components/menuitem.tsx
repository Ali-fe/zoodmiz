import { FaMinus, FaPlus } from 'react-icons/fa';
import Edible from '../types/edible';
import CoverArt from './coverart';
import { toPersianNumber } from '../utils/persianNumbers';

interface MenuItemProps {
  item: Edible;
  count?: number;
  onAddToCart: (item: Edible) => void;
  onRemoveFromCart?: (item: Edible) => void;
  isDarkTheme?: boolean;
}

const MenuItem = ({ item, count = 0, onAddToCart, onRemoveFromCart }: MenuItemProps) => {
  const hasDiscount = item.discount > 0;
  const finalPrice = Math.round(item.price * (1 - item.discount / 100));

  const stepButton =
    'grid h-8 w-8 place-items-center rounded-full transition-all duration-150 active:scale-90 [&>svg]:h-3 [&>svg]:w-3';

  return (
    <div className="group relative flex min-h-[120px] items-stretch gap-3 rounded-2xl border border-gray-100 bg-white p-2.5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift dark:border-gray-700 dark:bg-gray-800">
      {hasDiscount && (
        <span className="absolute -start-1 -top-1 z-10 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white shadow-card">
          {toPersianNumber(item.discount)}٪ تخفیف
        </span>
      )}

      <CoverArt
        name={item.name}
        src={item.imageURL}
        className="h-28 w-28 shrink-0 rounded-xl sm:h-32 sm:w-32"
        textClass="text-3xl"
      />

      <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
        <div>
          <h3 className="line-clamp-1 text-sm font-bold text-gray-800 dark:text-white">{item.name}</h3>
          {item.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-end justify-between gap-2">
          <div className="flex items-baseline gap-2">
            {hasDiscount && (
              <span className="text-xs line-through text-gray-400 dark:text-gray-500">
                {toPersianNumber(item.price.toLocaleString())}
              </span>
            )}
            <span
              className={`text-sm font-bold ${
                hasDiscount ? 'text-emerald-600 dark:text-emerald-400' : 'text-gray-800 dark:text-white'
              }`}
            >
              {toPersianNumber(finalPrice.toLocaleString())}
              <span className="ms-1 text-[11px] font-normal text-gray-500 dark:text-gray-400">تومان</span>
            </span>
          </div>

          {count === 0 ? (
            <button
              type="button"
              onClick={() => onAddToCart(item)}
              aria-label={`افزودن ${item.name} به سبد`}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-white shadow-card transition-all duration-150 hover:bg-primary-600 active:scale-95 [&>svg]:h-3 [&>svg]:w-3"
            >
              <FaPlus />
              افزودن
            </button>
          ) : (
            <div className="flex items-center gap-1 rounded-full border border-primary-200 bg-primary-50/70 p-1 dark:border-primary-500/30 dark:bg-primary-500/10">
              <button
                type="button"
                onClick={() => onRemoveFromCart && onRemoveFromCart(item)}
                aria-label="کاهش تعداد"
                className={`${stepButton} bg-white text-primary-700 shadow-sm hover:bg-primary-100 dark:bg-gray-800 dark:text-primary-200`}
              >
                <FaMinus />
              </button>
              <span className="min-w-[26px] text-center text-sm font-bold text-primary-800 dark:text-primary-200">
                {toPersianNumber(count)}
              </span>
              <button
                type="button"
                onClick={() => onAddToCart(item)}
                aria-label="افزایش تعداد"
                className={`${stepButton} bg-primary text-white hover:bg-primary-600`}
              >
                <FaPlus />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem;
