import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  FaSpinner,
  FaSearch,
  FaUserCircle,
  FaMapMarkerAlt,
} from "react-icons/fa";
import Edible from "../types/edible";
import { useMemo, useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import 'leaflet/dist/leaflet.css';
//import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import MenuItem from '../components/MenuItem';
import Footer from '../components/Footer';
import Cart from '../components/Cart';
import { edibleType } from '../data/data';
//import { toPersianNumber } from '../utils/persianNumbers';

interface CartItem extends Edible {
  quantity: number;
}

interface Address {
  street: string;
  city: string;
}

interface Location {
    lat: number;
    lng: number;
}

interface Restaurant {
  _id: string;
  name: string;
  description: string;
  address: Address;
  location: Location;
}

interface ApiResponse {
  menu: Edible[];
  resraurant: Restaurant;
}

const fetchMenu = async (restaurantId: string) => {
  const { data } = await axios.get(`/api/customer/menu/${restaurantId}`);
  return data;
};

type GroupedEdibles = {
  [key: string]: Edible[];
};

const PublicMenu = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const [activeCategory, setActiveCategory] = useState("");
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [notesInput, setNotesInput] = useState("");

  const { data, isLoading, isError, error } = useQuery<ApiResponse>({
    queryKey: ["publicMenu", restaurantId],
    queryFn: () => fetchMenu(restaurantId!),
    enabled: !!restaurantId,
  });

  const filteredMenuItems = useMemo(() => {
    const menu = data?.menu || [];
    if (!searchQuery) return menu;
    return menu.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.menu, searchQuery]);

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
    // For public menu, show a message to contact the restaurant
    alert("برای ثبت سفارش، لطفاً با رستوران تماس بگیرید یا از طریق اپلیکیشن سفارش دهید.");
  };

  useEffect(() => {
    if (Object.keys(groupedEdibles).length > 0 && !activeCategory) {
      setActiveCategory(Object.keys(groupedEdibles)[0]);
    }
  }, [groupedEdibles, activeCategory]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = Object.keys(groupedEdibles);
      let currentCategory = "";

      for (const sectionId of sections) {
        const section = sectionRefs.current[sectionId];
        if (section) {
          const rect = section.getBoundingClientRect();
          // Threshold of 150px from the top to activate the category
          if (rect.top >= 0 && rect.top <= 150) {
            currentCategory = sectionId;
            break;
          }
        }
      }

      if (currentCategory && activeCategory !== currentCategory) {
        setActiveCategory(currentCategory);
      }
    };

   // const mainContent = document.querySelector("main");
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [groupedEdibles, activeCategory]);

  const handleCategoryClick = (category: string) => {
    sectionRefs.current[category]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
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
    <div className="bg-white min-h-screen font-vazirmatn" dir="rtl">
      {/* Main Zoodmiz Navbar */}
      <nav className="sticky top-0 z-30 bg-white shadow-sm h-16">
        <div className="container mx-auto flex items-center justify-between h-full px-4">
          {/* Right Side: Logo */}
          <Link to="/" className="flex items-center gap-x-2">
            <img
              src="/photos/zoodmiz.svg"
              alt="Zoodmiz Logo"
              className="w-8 h-8"
            />
            <span className="text-xl font-bold font-vazirmatn-title text-gray-800">
              زودمیز
            </span>
          </Link>
          {/* Center: Search */}
          <div className="relative w-1/5">
            <input
              type="text"
              placeholder={`جستجو در منوی ${data?.resraurant?.name || ''}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 text-sm bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          {/* Left Side: Login/Register */}
          <Link
            to="/login"
            className="flex items-center gap-x-2 text-sm font-medium text-gray-600 hover:text-amber-600 transition-colors"
          >
            <FaUserCircle className="text-lg" />
            ورود / ثبت‌نام
          </Link>
        </div>
      </nav>
      <div className="container mx-auto flex justify-between gap-x-6 p-4 bg-gray-50">
        {/* Right Column: Categories & Restaurant Info */}
        <aside className="w-60 hidden md:block self-start sticky top-24 pt-4 bg-gray-50">
          {data?.resraurant && (
            <div className="mb-6 p-3 bg-gray-100">
              <h1 className="text-base font-bold text-gray-900 text-center">
                {data.resraurant.name}
              </h1>
              <p className="text-xs text-gray-600 mt-1.5 leading-relaxed">
                {data.resraurant.description}
              </p>
              <div className="flex items-start gap-x-2 text-xs text-gray-500 mt-2">
                <FaMapMarkerAlt className="mt-1 flex-shrink-0" />
                <span>{`${data.resraurant.address.city}, ${data.resraurant.address.street}`}</span>
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
                      className={`w-full text-right px-3 py-2 rounded-md transition-all duration-200 text-sm font-medium flex items-center gap-x-3 ${
                        activeCategory === category
                          ? "text-amber-700 bg-amber-50"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      <span
                        className={`h-5 w-1 rounded-full transition-all duration-200 ${
                          activeCategory === category
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
        <main className="flex-1 min-w-0 bg-gray-50">
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
                <h2 className="text-l font-bold text-gray-800 mb-4">{type}</h2>
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
            <div className="text-center py-10 w-full">
              <p className="text-gray-500">
                موردی برای نمایش در منو وجود ندارد.
              </p>
            </div>
          )}
        </main>

        {/* Left Column: Cart */}
        <aside className="w-80 hidden lg:block self-start sticky top-2">
          <Cart
            cart={cart}
            cartSummary={cartSummary}
            handleAddToCart={handleAddToCart}
            handleUpdateQuantity={handleUpdateQuantity}
            handleClearCart={handleClearCart}
            notesInput={notesInput}
            setNotesInput={setNotesInput}
            onSubmitOrder={handleSubmitOrder}
          />
        </aside>
      </div>
      <Footer />
    </div>
  );
};

export default PublicMenu;
 