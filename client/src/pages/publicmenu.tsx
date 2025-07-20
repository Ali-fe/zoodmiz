import { useParams } from "react-router-dom";
import { usePublicMenu, useCustomer, useRequestOtp, useVerifyOtp, useLogoutCustomer } from '../hooks/useCustomer';
import {
  FaSpinner,
  FaSearch,
  FaUserCircle,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaChevronDown,
} from "react-icons/fa";

import Edible from "../types/edible";
import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import 'leaflet/dist/leaflet.css';

//import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MenuItem from '../components/menuitem';
import Footer from '../components/footer';
import Cart from '../components/cart';
import { edibleType } from '../data/data';
//import { toPersianNumber } from '../utils/persianNumbers';

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

// Modal ساده برای دریافت شماره موبایل
function PhoneModal({
  open,
  onClose,
  onSubmit,
  error,
  loading
}: {
  open: boolean,
  onClose: () => void,
  onSubmit: (phone: string) => void,
  error?: string,
  loading?: boolean
}) {
  const [phone, setPhone] = useState('');
  useEffect(() => {
    if (!open) setPhone('');
  }, [open]);
  return !open ? null : (
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
}

// OtpModal
function OtpModal({ open, isNew, name, lastName, code, onChange, onClose, onSubmit, error, loading }: {
  open: boolean,
  isNew: boolean | null,
  name: string,
  lastName: string,
  code: string,
  onChange: (fields: Partial<{ name: string; lastName: string; code: string }>) => void,
  onClose: () => void,
  onSubmit: () => void,
  error?: string,
  loading?: boolean
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs mx-auto flex flex-col items-center">
        <h2 className="text-base font-bold mb-4 text-center">تایید شماره موبایل</h2>
        {isNew && (
          <>
            <input type="text" placeholder="نام" value={name} onChange={e => onChange({ name: e.target.value })} className="w-full px-1 py-0.5 text-base border rounded text-center focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2" disabled={loading} />
            <input type="text" placeholder="نام خانوادگی" value={lastName} onChange={e => onChange({ lastName: e.target.value })} className="w-full px-1 py-0.5 text-base border rounded text-center focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2" disabled={loading} />
          </>
        )}
        <input type="text" placeholder="کد پیامک" value={code} onChange={e => onChange({ code: e.target.value })} maxLength={5} className="w-full px-1 py-0.5 text-base border rounded text-center focus:outline-none focus:ring-2 focus:ring-amber-500 mb-2" disabled={loading} />
        {error && <div className="text-red-500 text-sm mt-1 mb-2">{error}</div>}
        <div className="flex gap-2 w-full mt-3">
          <button onClick={onClose} className="flex-1 p-1 text-sm rounded bg-gray-200 text-gray-700 font-bold" disabled={loading}>انصراف</button>
          <button
            onClick={onSubmit}
            disabled={loading || (isNew ? (name.length < 2 || lastName.length < 2 || code.length !== 5) : code.length !== 5)}
            className="flex-1 p-1 text-sm rounded bg-amber-500 text-white font-bold disabled:opacity-50"
          >
            {loading ? <FaSpinner className="inline animate-spin mr-1" /> : null}
            تایید
          </button>
        </div>
      </div>
    </div>
  );
}
// Loading component for PublicMenu
export const PublicMenuLoader = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
      <p className="text-gray-600 font-vazirmatn">در حال بارگذاری منو...</p>
    </div>
  </div>
);
const PublicMenu = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  
  // UI States
  const [uiState, setUiState] = useState({
    activeCategory: "",
    searchQuery: "",
    notesInput: "",
    showPhoneModal: false,
    showCartModal: false,
    showOtpModal: false,
    showUserMenu: false
  });

  // OTP States
  const [otpState, setOtpState] = useState({
    phone: '',
    isNew: null as boolean | null,
    name: '',
    lastName: '',
    code: '',
    error: ''
  });

  // User States
  const [userState, setUserState] = useState({
    phone: null as string | null
  });

  // Cart State
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Refs
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const userMenuRef = useRef<HTMLDivElement>(null);

  // API Hooks
  const { user: customer, isLoading: userLoading, refetch: refetchUser } = useCustomer();
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();
  const logoutCustomer = useLogoutCustomer();
  const { menu, restaurant, isLoading, error } = usePublicMenu(restaurantId!);

  // UI State Setters
  const updateUiState = (updates: Partial<typeof uiState>) => {
    setUiState(prev => ({ ...prev, ...updates }));
  };

  // OTP State Setters
  const updateOtpState = (updates: Partial<typeof otpState>) => {
    setOtpState(prev => ({ ...prev, ...updates }));
  };

  // User State Setters
  const updateUserState = (updates: Partial<typeof userState>) => {
    setUserState(prev => ({ ...prev, ...updates }));
  };

  const handlePhoneSubmit = (phone: string) => {
    updateOtpState({ error: '' });
    requestOtp.mutate(phone, {
      onSuccess: (data) => {
        updateOtpState({
          phone,
          isNew: data.isNew,
          name: '',
          lastName: '',
          code: ''
        });
        updateUiState({
          showPhoneModal: false,
          showOtpModal: true
        });
      },
      onError: (err: any) => {
        updateOtpState({ error: err?.response?.data?.msg || 'خطا در ارسال کد' });
      }
    });
  };

  const handleOtpSubmit = () => {
    updateOtpState({ error: '' });
    verifyOtp.mutate(
      otpState.isNew
        ? { phone: otpState.phone, code: otpState.code, name: otpState.name, lastName: otpState.lastName }
        : { phone: otpState.phone, code: otpState.code },
      {
        onSuccess: () => {
          updateUserState({ phone: otpState.phone });
          updateUiState({ showOtpModal: false });
          updateOtpState({
            phone: '',
            isNew: null,
            name: '',
            lastName: '',
            code: ''
          });
        },
        onError: (err: any) => {
          updateOtpState({ error: err?.response?.data?.msg || 'کد اشتباه است' });
        }
      }
    );
  };

  // بعد از ورود موفق، اطلاعات کاربر را رفرش کن
  useEffect(() => {
    if (userState.phone) refetchUser();
  }, [userState.phone]);

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

  const handleSubmitOrder = () => {
    if (!userState.phone) {
      updateUiState({ showPhoneModal: true });
      return;
    }
    // مرحله بعد: ثبت سفارش واقعی یا دریافت اطلاعات بیشتر
    alert("ثبت سفارش با شماره: " + userState.phone);
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
    <div className="bg-white min-h-screen font-vazirmatn" dir="rtl">
      {/* Modal ورود شماره */}
      <PhoneModal
        open={uiState.showPhoneModal}
        onClose={() => updateUiState({ showPhoneModal: false })}
        onSubmit={handlePhoneSubmit}
        error={
          otpState.error ||
          (typeof requestOtp.error === 'string'
            ? requestOtp.error
            : requestOtp.error?.response?.data?.msg ||
              requestOtp.error?.message ||
              undefined)
        }
        loading={requestOtp.isPending}
      />
      {/* Modal تایید شماره موبایل */}
      <OtpModal
        open={uiState.showOtpModal}
        isNew={!!otpState.isNew}
        name={otpState.name}
        lastName={otpState.lastName}
        code={otpState.code}
        onChange={fields => {
          if (fields.name !== undefined) updateOtpState({ name: fields.name });
          if (fields.lastName !== undefined) updateOtpState({ lastName: fields.lastName });
          if (fields.code !== undefined) updateOtpState({ code: fields.code });
        }}
        onClose={() => updateUiState({ showOtpModal: false })}
        onSubmit={handleOtpSubmit}
        error={
          otpState.error ||
          (typeof verifyOtp.error === 'string'
            ? verifyOtp.error
            : verifyOtp.error?.response?.data?.msg ||
              verifyOtp.error?.message ||
              undefined)
        }
        loading={verifyOtp.isPending}
      />

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
      <nav className="sticky top-0 z-30 bg-white shadow-sm h-14 md:h-12">
        <div className="max-w-auto mx-auto flex items-center justify-between h-full px-2 md:px-4 gap-x-4 md:gap-x-8">
          {/* Right Side: Logo */}
          <Link to="/" className="flex items-center gap-x-2">
            <img
              src="/photos/zoodmiz.svg"
              alt="Zoodmiz Logo"
              className="w-8 h-8"
            />
            <span className="text-base md:text-xl font-bold font-vazirmatn-title text-gray-800">
              زودمیز
            </span>
          </Link>
          {/* Center: Search */}
          <div className="relative w-8/12 max-w-xs md:w-1/3">
            <input
              type="text"
              placeholder={`جستجو در منوی ${restaurant?.name || ''}`}
              value={uiState.searchQuery}
              onChange={(e) => updateUiState({ searchQuery: e.target.value })}
              className="w-full h-8 p-1 text-sm text-center bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          {/* Left Side: Login/Register or User */}
          <div className="flex items-center gap-2">
            {userLoading ? null : customer ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => updateUiState({ showUserMenu: !uiState.showUserMenu })}
                  className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-amber-500 transition-colors"
                >
                  <FaUserCircle className="text-amber-500 text-lg md:text-xl" />
                  {customer.name}
                  <FaChevronDown className={`text-xs transition-transform ${uiState.showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {uiState.showUserMenu && (
                  <div className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <button
                      onClick={() => {
                        logoutCustomer.mutate(undefined, { onSuccess: () => refetchUser() });
                        updateUiState({ showUserMenu: false });
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
                      disabled={logoutCustomer.isPending}
                    >
                      {logoutCustomer.isPending ? <FaSpinner className="animate-spin text-xs" /> : <FaSignOutAlt className="text-xs" />}
                      خروج
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => updateUiState({ showPhoneModal: true })}
                className="flex items-center gap-1 px-3 py-1.5 rounded bg-amber-500 text-white text-sm hover:bg-amber-600 transition"
              >
                <FaUserCircle className="text-lg md:text-xl" />
                ورود
              </button>
            )}
          </div>
        </div>
      </nav>
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
                  <span>{`${restaurant.address.city}, ${restaurant.address.street}`}</span>
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
          <main className="flex-1 bg-gray-100 rounded-xl p-3 ">
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
          <aside className="w-70 hidden lg:block self-start sticky top-14 bg-gray-100">
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
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
        <div className="bg-white border-t shadow-lg px-4 py-2.5 flex items-center justify-between">
          <button onClick={() => updateUiState({ showCartModal: true })} className="font-bold text-sm md:text-base flex items-center gap-2">
            <span>سبد خرید</span>
            {cart.length > 0 && (
              <span className="bg-amber-500 text-white rounded-full px-2 py-0.5 text-xs font-bold">{cart.length}</span>
            )}
          </button>
          {false?<button onClick={handleSubmitOrder} className="bg-amber-500 text-white rounded px-4 py-2 text-sm">ثبت سفارش</button>:''}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PublicMenu;
