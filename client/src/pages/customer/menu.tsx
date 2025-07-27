import { useParams } from "react-router-dom";
import { useMenu, useCustomer } from '../../hooks/useCustomer';
import {
  FaSpinner,
  FaMapMarkerAlt,
} from "react-icons/fa";

import Edible from "../../types/edible";
import { useMemo, useState, useEffect, useRef } from "react";
import { useCustomerContext } from './customerlayout';
import 'leaflet/dist/leaflet.css';

//import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MenuItem from '../../components/menuitem';
import Cart from '../../components/cart';
import { edibleType } from '../../data/data';
import { toPersianNumber, tableNumberToLabel } from '../../utils/persianNumbers';

import { TextInput } from '../../components/dashboard/inputs';


interface CartItem extends Edible {
  quantity: number;
}

// interface Address {
//   street: string;
//   city: string;
// }

// interface Location {
//   lat: number;
//   lng: number;
// }

// interface Restaurant {
//   _id: string;
//   name: string;
//   description: string;
//   address: Address;
//   location: Location;
// }

type GroupedEdibles = {
  [key: string]: Edible[];
};

// Loading component for Menu
export const MenuLoader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
      <p className="text-gray-600 font-vazirmatn">در حال بارگذاری منو...</p>
    </div>
  </div>
);
const Menu = () => {
  const { restaurantId, table } = useParams<{ restaurantId: string, table: string }>();
  
  // UI State from context
  const { uiState, updateUiState, userState } = useCustomerContext();

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Refs
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const userMenuRef = useRef<HTMLDivElement>(null);

  // API Hooks
  const { user: customer } = useCustomer();
  const { menu, restaurant, isLoading, error } = useMenu(restaurantId!);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        updateUiState({ showUserMenu: false });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredMenuItems = useMemo(() => {
    const menuItems = menu || [];
    if (!uiState.searchQuery) return menuItems;
    return menuItems.filter((item) =>
      item.name.toLowerCase().includes(uiState.searchQuery.toLowerCase())
    );
  }, [menu, uiState.searchQuery]);

  const groupedEdibles = useMemo(() => {
    if (!filteredMenuItems) return {};

    const ediblesByType = filteredMenuItems.reduce(
      (acc: GroupedEdibles, edible) => {
        const { type } = edible;
        if (!acc[type]) acc[type] = [];
        acc[type].push(edible);
        return acc;
      },
      {}
    );

    const sortedKeys = Object.keys(ediblesByType).sort((a, b) => {
      const indexA = edibleType.indexOf(a);
      const indexB = edibleType.indexOf(b);
      if (indexA !== -1 && indexB !== -1) return indexA - indexB;
      if (indexA !== -1) return -1;
      if (indexB !== -1) return 1;
      return a.localeCompare(b);
    });

    const result: GroupedEdibles = {};
    for (const key of sortedKeys) {
      result[key] = ediblesByType[key];
    }
    return result;
  }, [filteredMenuItems]);

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
      const existingItem = currentCart.find(
        (cartItem) => cartItem._id === item._id
      );
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

  // State for final order modal
  const [showOrderConfirmModal, setShowOrderConfirmModal] = useState(false);

  const handleSubmitOrder = () => {
    if (!customer) {
      updateUiState({ showCartModal: false });
      setTimeout(() => {
        updateUiState({ showPhoneModal: true });
      }, 300); // کمی تاخیر برای بسته شدن انیمیشن سبد خرید
      return;
    }
    // باز کردن مودال تایید نهایی سفارش
    setShowOrderConfirmModal(true);
  };

  useEffect(() => {
    if (Object.keys(groupedEdibles).length > 0 && !uiState.activeCategory) {
      updateUiState({ activeCategory: Object.keys(groupedEdibles)[0] });
    }
  }, [groupedEdibles, uiState.activeCategory]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = Object.keys(groupedEdibles);
      let currentCategory = "";

      for (const sectionId of sections) {
        const section = sectionRefs.current[sectionId];
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            currentCategory = sectionId;
            break;
          }
        }
      }

      if (currentCategory && currentCategory !== uiState.activeCategory) {
        updateUiState({ activeCategory: currentCategory });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [groupedEdibles, uiState.activeCategory]);

  const handleCategoryClick = (category: string) => {
    updateUiState({ activeCategory: category });
    const section = sectionRefs.current[category];
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <FaSpinner className="animate-spin text-4xl text-amber-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-red-600 bg-gray-50">
        <p className="text-xl font-semibold">خطا در بارگذاری منو</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  return (
    <>
      {/* Modal سبد خرید موبایل */}
      {uiState.showCartModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white w-full md:max-w-md rounded-t-2xl md:rounded-2xl shadow-lg p-2 md:p-4 animate-slideup relative">
            <button onClick={() => updateUiState({ showCartModal: false })} className="absolute left-4 top-4 text-gray-400 hover:text-red-500 text-2xl font-bold">×</button>
            <Cart
              cart={cart}
              cartSummary={cartSummary}
              handleAddToCart={handleAddToCart}
              handleUpdateQuantity={handleUpdateQuantity}
              handleClearCart={handleClearCart}
              notesInput={uiState.notesInput}
              setNotesInput={(value: string) => updateUiState({ notesInput: value })}
              onSubmitOrder={handleSubmitOrder}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* Main Zoodmiz Navbar */}
      {/* This navbar is now handled by CustomerLayout */}

      <div className="container mx-auto flex justify-between gap-x-3 p-2 bg-gray-50 min-h-screen">
        {/* Right Column: Categories & Restaurant Info */}
        <aside className="w-70 hidden xl:block self-start sticky top-14 rounded-xl bg-gray-100">
          {restaurant && (
            <div className="mb-6 p-3">
              <h1 className="text-base md:text-lg font-bold text-gray-900 text-center">
                {restaurant.name}
              </h1>
              <p className="text-xs md:text-sm text-gray-600 mt-1.5 leading-relaxed">
                {restaurant.description}
              </p>
              <div className="flex items-start gap-x-2 text-sm text-gray-500 mt-2">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                <span>{`${restaurant.address?.city || ''}, ${restaurant.address?.street || ''}`}</span>
              </div>
            </div>
          )}
          {Object.keys(groupedEdibles).length > 0 && (
            <nav className="bg-gray-100 p-2">
              <ul className="space-y-1">
                {Object.keys(groupedEdibles).map((category) => (
                  <li key={category}>
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className={`w-full text-right px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium flex items-center gap-x-3 ${uiState.activeCategory === category
                        ? "text-amber-700 bg-amber-50"
                        : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`h-5 w-1 rounded-full transition-all duration-200 ${uiState.activeCategory === category
                          ? "bg-amber-600"
                          : "bg-transparent"
                        }`}
                      ></span>
                      {category}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </aside>
        {/* Middle Column: Menu */}
        <main className="flex-1 rounded-xl p-3 ">
          {Object.keys(groupedEdibles).length > 0 ? (
            Object.entries(groupedEdibles).map(([type, edibles]) => (
              <section
                key={type}
                id={type}
                className="mb-8 scroll-mt-6"
                ref={(el) => {
                  sectionRefs.current[type] = el;
                }}
              >
                <h2 className="text-base md:text-lg font-bold text-gray-800 mb-4">{type}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div className="text-center py-16">
              <p className="text-gray-500">
                موردی برای نمایش در منو وجود ندارد.
              </p>
            </div>
          )}
        </main>
        {/* Left Column: Cart */}
        <aside className="w-90 hidden lg:block self-start sticky top-14 bg-gray-100">
          <Cart
            cart={cart}
            cartSummary={cartSummary}
            handleAddToCart={handleAddToCart}
            handleUpdateQuantity={handleUpdateQuantity}
            handleClearCart={handleClearCart}
            notesInput={uiState.notesInput}
            setNotesInput={(value: string) => updateUiState({ notesInput: value })}
            onSubmitOrder={handleSubmitOrder}
          />
        </aside>
      </div>

      {/* نوار پایین موبایل */}
      <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
        <div className="bg-white border-t shadow-lg px-2 py-3.5 flex items-center justify-between">
          <button onClick={() => updateUiState({ showCartModal: true })} className="font-bold text-sm  flex items-center gap-2">
            <span>سبد خرید</span>
            {cart.length > 0 && (
              <span className="bg-amber-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">{cart.length}</span>
            )}
          </button>
          {false?<button onClick={handleSubmitOrder} className="bg-amber-500 text-white rounded px-4 py-2 text-sm">ثبت سفارش</button>:''}
        </div>
      </div>
      {/* مودال تایید نهایی سفارش */}
      {showOrderConfirmModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs mx-auto flex flex-col items-center">
            <h2 className="text-base font-bold mb-4 text-center">تایید اطلاعات سفارش</h2>
            <form className="w-full space-y-3">
              <TextInput
                label="نام"
                name="name"
                value={customer?.name || ''}
                disabled
                className="bg-gray-100 text-gray-700"
              />
              <TextInput
                label="نام خانوادگی"
                name="lastName"
                value={customer?.lastName || ''}
                disabled
                className="bg-gray-100 text-gray-700"
              />
              <TextInput
                label="شماره تماس"
                name="phone"
                value={toPersianNumber((customer?.phone || userState.phone || '').replace(/[^0-9]/g, ''))}
                disabled
                className="bg-gray-100 text-gray-700 text-left font-vazirmatn"
                inputProps={{ dir: "rtl" }}
              />
              <TextInput
                label="شماره میز"
                name="table"
                value={tableNumberToLabel(table || '')}
                disabled
                className="bg-gray-100 text-gray-700 text-left font-vazirmatn"
                inputProps={{ dir: "rtl" }}
              />
              <div className="flex gap-2 mt-4">
                <button type="button" onClick={() => setShowOrderConfirmModal(false)} className="flex-1 p-1 text-sm rounded bg-gray-200 text-gray-700 font-bold">انصراف</button>
                <button type="button" className="flex-1 p-1 text-sm rounded bg-amber-500 text-white font-bold">ثبت سفارش</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
