import { useState, useMemo, useEffect, useRef } from 'react';
import { FaSpinner, FaSearch } from 'react-icons/fa';
import { useMenu } from '../../hooks/useEdibles';
import Edible from '../../types/edible';
import MenuItem from '../../components/MenuItem';
import Cart from '../../components/Cart';

// تبدیل اعداد انگلیسی به فارسی
const toPersianNumber = (input: number | string) => {
  return input.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

interface CartItem extends Edible {
  quantity: number;
}

const Menu = () => {
  const { data: edibles = [], isLoading, isError, error } = useMenu();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tableNumber, setTableNumber] = useState('');

  // گروه‌بندی آیتم‌ها بر اساس نوع
  const groupedEdibles = useMemo(() => {
    const filtered = edibles.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered.reduce((acc: Record<string, Edible[]>, edible) => {
      const { type } = edible;
      if (!acc[type]) acc[type] = [];
      acc[type].push(edible);
      return acc;
    }, {});
  }, [edibles, searchQuery]);

  const cartSummary = useMemo(() => {
    return cart.reduce(
      (summary, item) => {
        const originalPrice = item.price * item.quantity;
        const discountAmount = Math.round(
          originalPrice * (item.discount / 100)
        );
        summary.totalOriginalPrice += originalPrice;
        summary.totalDiscount += discountAmount;
        return summary;
      },
      { totalOriginalPrice: 0, totalDiscount: 0 }
    );
  }, [cart]);

  const handleAddToCart = (item: Edible) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem._id === item._id);
      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...currentCart, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (itemId: string, amount: number) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item._id === itemId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleClearCart = () => {
    setCart([]);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-amber-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600 bg-gray-50">
        <p className="text-xl font-semibold">خطا در بارگذاری منو</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className=" flex bg-gray-50 h-full">
      <div className="flex flex-col h-full overflow-y-auto px-2 flex-grow w-2/3">
        <div className="sticky top-0 z-30 bg-gray-50 pt-2 pb-2">
          <div className="relative w-full md:w-2/3 mx-auto">
            <input
              type="text"
              placeholder="جستجو در منو..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
        {Object.keys(groupedEdibles).length > 0 ? (
          Object.entries(groupedEdibles).map(([type, edibles]) => (
            <section key={type} className="mb-8 scroll-mt-6">
              <h2 className="text-l font-bold text-gray-800 mb-4">{type}</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {edibles.map((item) => (
                  <MenuItem
                    key={item._id}
                    item={item}
                    count={cart.find((c) => c._id === item._id)?.quantity || 0}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={(item) => handleUpdateQuantity(item._id, -1)}
                  />
                ))}
              </div>
            </section>
          ))
        ) : (
          <div className="text-center py-10 w-full">
            <p className="text-gray-500">
              موردی برای نمایش در منو وجود ندارد.
            </p>
          </div>
        )}
      </div>
      
      <div className="hidden lg:block w-1/3 sticky top-2 bg-gray-50 border-l border-gray-200 ">
        <Cart
          cart={cart}
          cartSummary={cartSummary}
          handleAddToCart={handleAddToCart}
          handleUpdateQuantity={handleUpdateQuantity}
          handleClearCart={handleClearCart}
          toPersianNumber={toPersianNumber}
        />
      </div>
    </div>
  );
};

export default Menu;