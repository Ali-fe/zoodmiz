//import { FaMinus, FaPlus } from 'react-icons/fa';
import Edible from '../types/edible';
import { toPersianNumber } from '../utils/persianNumbers';

interface MenuItemProps {
  item: Edible;
  count?: number;
  onAddToCart: (item: Edible) => void;
  onRemoveFromCart?: (item: Edible) => void;
  isDarkTheme?: boolean;
}

const MenuItem = ({ item, count = 0, onAddToCart, onRemoveFromCart, isDarkTheme }: MenuItemProps) => {
  const hasDiscount = item.discount > 0;
  const finalPrice = Math.round(item.price * (1 - item.discount / 100));

  return (
    <div
      className={`relative group transition-transform rounded-2xl p-4 flex gap-4 items-center min-h-[120px] ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} ${isDarkTheme ? 'text-white' : ''}`}
    >
      {/* تصویر مربع و وسط کارت */}
      <div className="flex flex-col justify-center items-center h-full">
        {item.imageURL ? (
          <img
            src={item.imageURL}
            alt={item.name}
            className="w-40 h-40 object-cover rounded-xl flex-shrink-0 shadow-sm"
          />
        ) : (
          <div className={`w-40 h-40 rounded-xl flex-shrink-0 ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
        )}
      </div>
      {/* اطلاعات */}
      <div className="flex-1 flex flex-col gap-2 justify-between h-full">
        <h3 className={`font-bold text-l line-clamp-1 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>{item.name}</h3>
        {item.description && (
          <p className={`text-xs line-clamp-2 ${isDarkTheme ? 'text-gray-300' : 'text-gray-500'}`}>{item.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {hasDiscount ? (
            <>
              <span className={`line-through text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-400'}`}>{toPersianNumber(item.price.toLocaleString())}</span>
              <span className={`font-bold text-base ${isDarkTheme ? 'text-green-400' : 'text-green-600'}`}>{toPersianNumber(finalPrice.toLocaleString())} <span className="text-xs font-normal">تومان</span></span>
              <span className={`text-xs rounded px-2 py-0.5 font-bold ${isDarkTheme ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>{toPersianNumber(item.discount)}%</span>
            </>
          ) : (
            <span className={`font-bold text-base ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>{toPersianNumber(item.price.toLocaleString())} <span className="text-xs font-normal">تومان</span></span>
          )}
        </div>
        {/* کنترل افزودن/کاستن */}
        <div className="flex items-center gap-2 mt-3">
          {count === 0 ? (
            <button
              onClick={() => onAddToCart(item)}
              className={`w-11 h-11 flex items-center justify-center bg-amber-500 text-white rounded-full text-2xl shadow hover:bg-amber-600 transition-all duration-150 mx-auto`}
              aria-label="افزودن به سبد"
            >
              +
            </button>
          ) : (
            <div className={`flex items-center gap-2 border rounded-full px-2 py-1 shadow-sm mx-auto ${isDarkTheme ? 'bg-gray-900 border-gray-700' : 'bg-white/80 border-amber-200'}` }>
              <button
                onClick={() => onRemoveFromCart && onRemoveFromCart(item)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-xl font-bold transition-all duration-150 ${isDarkTheme ? 'bg-gray-700 text-amber-400 hover:bg-gray-800 hover:text-amber-300' : 'bg-gray-200 text-amber-600 hover:bg-amber-100 hover:text-amber-700'}`}
                aria-label="کاهش تعداد"
              >
                -
              </button>
              <span className={`font-bold text-base min-w-[28px] text-center rounded px-2 py-0.5 ${isDarkTheme ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-800'}`}>{toPersianNumber(count)}</span>
              <button
                onClick={() => onAddToCart(item)}
                className={`w-8 h-8 flex items-center justify-center bg-amber-500 text-white rounded-full text-xl font-bold hover:bg-amber-600 transition-all duration-150`}
                aria-label="افزایش تعداد"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MenuItem; 