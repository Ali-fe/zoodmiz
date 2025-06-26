import Edible from '../types/edible';

// تبدیل اعداد انگلیسی به فارسی
const toPersianNumber = (input: number | string) => {
  return input.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

interface MenuItemProps {
  item: Edible;
  count?: number;
  onAddToCart: (item: Edible) => void;
  onRemoveFromCart?: (item: Edible) => void;
}

const MenuItem = ({ item, count = 0, onAddToCart, onRemoveFromCart }: MenuItemProps) => {
  const hasDiscount = item.discount > 0;
  const finalPrice = Math.round(item.price * (1 - item.discount / 100));

  return (
    <div
      className={`relative group transition-transform  bg-white rounded-2xl p-4 flex gap-4 items-center min-h-[120px] ${count > 0 ? 'bg-amber-50' : ''}`}
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
          <div className="w-40 h-40 bg-gray-100 rounded-xl flex-shrink-0"></div>
        )}
      </div>
      {/* اطلاعات */}
      <div className="flex-1 flex flex-col gap-2 justify-between h-full">
        <h3 className="font-bold text-l text-gray-800 line-clamp-1">{item.name}</h3>
        {item.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center gap-2 mt-1">
          {hasDiscount ? (
            <>
              <span className="text-gray-400 line-through text-xs">{toPersianNumber(item.price.toLocaleString())}</span>
              <span className="font-bold text-base text-green-600">{toPersianNumber(finalPrice.toLocaleString())} <span className="text-xs font-normal">تومان</span></span>
              <span className="bg-green-100 text-green-700 text-xs rounded px-2 py-0.5 font-bold">{toPersianNumber(item.discount)}%</span>
            </>
          ) : (
            <span className="font-bold text-base text-gray-800">{toPersianNumber(item.price.toLocaleString())} <span className="text-xs font-normal">تومان</span></span>
          )}
        </div>
        {/* کنترل افزودن/کاستن */}
        <div className="flex items-center gap-2 mt-3">
          {count === 0 ? (
            <button
              onClick={() => onAddToCart(item)}
              className="w-11 h-11 flex items-center justify-center bg-amber-500 text-white rounded-full text-2xl shadow  hover:bg-amber-600 transition-all duration-150 mx-auto"
              aria-label="افزودن به سبد"
            >
              +
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-white/80 border border-amber-200 rounded-full px-2 py-1 shadow-sm mx-auto">
              <button
                onClick={() => onRemoveFromCart && onRemoveFromCart(item)}
                className="w-8 h-8 flex items-center justify-center bg-gray-200 text-amber-600 rounded-full text-xl font-bold hover:bg-amber-100 hover:text-amber-700 transition-all duration-150"
                aria-label="کاهش تعداد"
              >
                -
              </button>
              <span className="font-bold text-base text-gray-800 min-w-[28px] text-center bg-gray-100 rounded px-2 py-0.5">
                {toPersianNumber(count)}
              </span>
              <button
                onClick={() => onAddToCart(item)}
                className="w-8 h-8 flex items-center justify-center bg-amber-500 text-white rounded-full text-xl font-bold hover:bg-amber-600 transition-all duration-150"
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