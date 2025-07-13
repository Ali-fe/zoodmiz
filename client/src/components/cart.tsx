import Edible from '../types/edible';
import { FaTrash } from 'react-icons/fa';
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
}

const Cart = ({ cart, cartSummary, handleAddToCart, handleUpdateQuantity, handleClearCart, isDarkTheme, notesInput, setNotesInput, onSubmitOrder }: CartProps) => {
  return (
    <aside className="hidden lg:block self-start sticky top-0 h-full">
      {cart.length === 0 ? (
        <div className={`p-4 h-full text-center ${isDarkTheme ? 'bg-gray-800 text-gray-300' : 'bg-gray-50'}` }>
          <svg
            className={`mx-auto h-12 w-12 ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="mt-2 text-sm font-medium text-gray-500">
            سبد خرید شما خالی است
          </p>
        </div>
      ) : (
        <div className={`p-3 h-full ${isDarkTheme ? 'bg-gray-800 text-gray-100' : 'bg-gray-50'}` }>
          <div className={`p-3 border-b flex justify-between items-center ${isDarkTheme ? 'border-gray-700' : ''}` }>
            <h2 className="text-base font-bold">سبد خرید</h2>
            <button
              onClick={handleClearCart}
              title="خالی کردن سبد"
              className={`transition-colors ${isDarkTheme ? 'text-gray-400 hover:text-red-400' : 'text-gray-400 hover:text-red-600'}`}
            >
              <FaTrash />
            </button>
          </div>
          <div className="p-2 divide-y max-h-96 overflow-y-auto">
            {cart.map((item) => (
              <div key={item._id} className="py-2 px-2">
                <p className="font-medium text-xs truncate">{item.name}</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className={`w-6 h-6 flex items-center justify-center rounded font-bold transition-colors ${isDarkTheme ? 'bg-green-900 text-green-300 hover:bg-green-800' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                    >
                      +
                    </button>
                    <span className="font-bold text-xs">
                      {toPersianNumber(item.quantity)}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item._id, -1)}
                      className={`w-6 h-6 flex items-center justify-center rounded font-bold transition-colors ${isDarkTheme ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-red-100 text-red-700 hover:bg-red-200'}`}
                    >
                      -
                    </button>
                  </div>
                  <p className={`text-xs ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}` }>
                    {toPersianNumber((
                      Math.round(item.price * (1 - item.discount / 100)) *
                      item.quantity
                    ).toLocaleString())} تومان
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-2 text-xs mb-3">
            <div className="flex justify-between">
              <span className={`${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>جمع کل</span>
              <span>
                {toPersianNumber(cartSummary.totalOriginalPrice.toLocaleString())} تومان
              </span>
            </div>
            {cartSummary.totalDiscount > 0 && (
              <div className="flex justify-between text-red-600">
                <span>سود شما از تخفیف</span>
                <span>
                  - {toPersianNumber(cartSummary.totalDiscount.toLocaleString())} تومان
                </span>
              </div>
            )}
          </div>
          <div className="border-t pt-3">
            <div className="mt-4">
              <label
                htmlFor="order-notes"
                className={`text-xs font-medium ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}
              >
                توضیحات سفارش
              </label>
              <textarea
                id="order-notes"
                rows={2}
                placeholder="مثلا: سس اضافه لطفا..."
                className={`mt-1 w-full px-3 py-2 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 ${isDarkTheme ? 'bg-gray-900 border-gray-700 text-white placeholder-gray-400' : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'}`}
                value={notesInput}
                onChange={e => setNotesInput(e.target.value)}
              ></textarea>
            </div>
            <button
              className={`w-full mt-3 font-bold py-2.5 rounded-lg transition-colors text-sm shadow-lg ${isDarkTheme ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-green-600 text-white hover:bg-green-700'}`}
              onClick={onSubmitOrder}
            >
              ثبت و تکمیل سفارش
            </button>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Cart; 