import { useState, useMemo } from 'react';
import { FaSpinner, /*FaSearch*/ } from 'react-icons/fa';
import { useMenu } from '../../hooks/useEdibles';
import Edible from '../../types/edible';
import MenuItem from '../../components/menuitem';
import Cart from '../../components/cart';
import { useDashboardContext } from './dashboard';
import { useCreateOrder } from '../../hooks/useOrders';
import { TextInput, SelectInput } from '../../components/dashboard/inputs';
import { toPersianNumber } from '../../utils/persianNumbers';
import { useTables } from '../../hooks/useTables';

const Menu = () => {
  const { data: edibles = [], isLoading, isError, error } = useMenu();
  const { data: tables = []/*, isLoading: tablesLoading*/ } = useTables();
  const { isDarkTheme,searchQuery, cart ,setCart } = useDashboardContext();

  // Modal and order state
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    table: '',
    notesInput: ''
  });
  const { mutate: createOrder, isPending: isSubmitting } = useCreateOrder(() => {
    setShowModal(false);
    setFormData({
      customerName: '',
      customerPhone: '',
      table: '',
      notesInput: ''
    });
    setCart([]);
  });

  const openOrderModal = () => setShowModal(true);

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
      <div className={`flex justify-center items-center min-h-screen ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <FaSpinner className="animate-spin text-4xl text-amber-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`flex flex-col justify-center items-center min-h-screen text-red-600 ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}> 
        <p className="text-xl font-semibold">خطا در بارگذاری منو</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className={`flex h-full ${isDarkTheme ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="flex flex-col h-full overflow-y-auto px-2 flex-grow w-2/3">
        {Object.keys(groupedEdibles).length > 0 ? (
          Object.entries(groupedEdibles).map(([type, edibles]) => (
            <section key={type} className="mb-8 scroll-mt-6">
              <h2 className={`text-l font-bold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>{type}</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {edibles.map((item) => (
                  <MenuItem
                    key={item._id}
                    item={item}
                    count={cart.find((c) => c._id === item._id)?.quantity || 0}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={(item) => handleUpdateQuantity(item._id, -1)}
                    isDarkTheme={isDarkTheme}
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
      
      <div className={`hidden lg:block w-1/3 sticky top-0 p-2 ${isDarkTheme ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}> 
        <Cart
          cart={cart}
          cartSummary={cartSummary}
          handleAddToCart={handleAddToCart}
          handleUpdateQuantity={handleUpdateQuantity}
          handleClearCart={handleClearCart}
          isDarkTheme={isDarkTheme}
          notesInput={formData.notesInput}
          setNotesInput={(value) => setFormData({ ...formData, notesInput: value })}
          onSubmitOrder={openOrderModal}
        />
      </div>
      {/* Modal for order info */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-lg p-4 max-w-sm w-full transition-all duration-300 overflow-hidden ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}` }>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>ثبت اطلاعات سفارش</h2>
              <button
                onClick={() => setShowModal(false)}
                className={`p-2 rounded-md transition-colors duration-200 ${isDarkTheme ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                createOrder({
                  customerName: formData.customerName,
                  customerPhone: formData.customerPhone,
                  table: Number(formData.table),
                  notes: formData.notesInput,
                  items: cart.map(item => ({
                    edible: item._id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    discount: item.discount,
                  })),
                });
              }}
              className="space-y-4"
            >
              <TextInput
                label="نام مشتری"
                name="customerName"
                type="text"
                value={formData.customerName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
              <TextInput
                label="شماره تماس"
                name="customerPhone"
                type="text"
                value={formData.customerPhone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, customerPhone: e.target.value })}
              />
              <SelectInput
                label="شماره میز"
                name="tableNumber"
                value={formData.table}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, table: e.target.value })}
                required
              >
                <option value="">انتخاب میز</option>
                {tables
                  .filter((table) => table.status === 'available')
                  .map((table) => (
                    <option key={table._id} value={table.numeral}>
                      میز {toPersianNumber(table.numeral)} (ظرفیت: {toPersianNumber(table.capacity)} نفر)
                    </option>
                  ))}
              </SelectInput>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium ${isDarkTheme ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-all duration-200`}
                  disabled={isSubmitting}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-3 py-1 text-sm rounded-md font-medium ${isDarkTheme ? 'bg-green-700 hover:bg-green-800 text-white' : 'bg-green-600 hover:bg-green-700 text-white'} transition-all duration-200 disabled:opacity-60`}
                >
                  {isSubmitting ? 'در حال ثبت...' : 'ثبت سفارش'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;