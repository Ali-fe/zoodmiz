import { useParams } from "react-router-dom";
import { useMenu, useCustomer } from '../../hooks/useCustomer';
import { useCreateCustomerOrder } from '../../hooks/useCustomerOrders';
import {
  FaMapMarkerAlt,
  FaShoppingBasket,
  FaTable,
  FaTimes,
  FaUtensils,
} from "react-icons/fa";

import Edible from "../../types/edible";
import { useMemo, useState, useEffect, useRef } from "react";
import { useCustomerContext } from './customerlayout';
import MenuItem from '../../components/menuitem';
import Cart from '../../components/cart';
import ReservationModal from '../../components/customer/ReservationModal';
import { edibleType } from '../../data/data';
import { toPersianNumber, tableNumberToLabel } from '../../utils/persianNumbers';
import CoverArt from '../../components/coverart';
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
  Panel,
} from '../../components/dashboard/ui';

interface CartItem extends Edible {
  quantity: number;
}

type GroupedEdibles = {
  [key: string]: Edible[];
};

const InfoRow = ({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) => (
  <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-gray-200 py-2 text-xs last:border-0 dark:border-gray-700">
    <span className="shrink-0 font-bold text-gray-500 dark:text-gray-400">{label}</span>
    <span
      className={
        highlight
          ? "text-sm font-bold text-primary-800 dark:text-primary-200"
          : "text-gray-800 dark:text-gray-100"
      }
    >
      {value}
    </span>
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
  const chipRefs = useRef<Record<string, HTMLElement | null>>({});

  // API Hooks
  const { user: customer } = useCustomer();
  const { menu, restaurant, isLoading, error, refetch } = useMenu(restaurantId!);

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

  const payable = cartSummary.totalOriginalPrice - cartSummary.totalDiscount;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const categories = useMemo(() => Object.keys(groupedEdibles), [groupedEdibles]);

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
  const [showReservationModal, setShowReservationModal] = useState(false);

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

  const createOrder = useCreateCustomerOrder(() => {
    setShowOrderConfirmModal(false);
    updateUiState({ showCartModal: false });
    setCart([]);
  });

  const handleFinalOrderSubmit = () => {
    if (!customer || !restaurant) return;
    createOrder.mutate({
      restaurant: restaurant._id,
      customerName: customer.name + (customer.lastName ? ' ' + customer.lastName : ''),
      customerPhone: customer.phone,
      table: Number(table),
      notes: uiState.notesInput,
      items: cart.map(item => ({
        edible: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount || 0,
      })),
    });
  };

  useEffect(() => {
    if (categories.length > 0 && !uiState.activeCategory) {
      updateUiState({ activeCategory: categories[0] });
    }
  }, [categories, uiState.activeCategory]);

  useEffect(() => {
    const handleScroll = () => {
      let currentCategory = "";

      for (const sectionId of categories) {
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
  }, [categories, uiState.activeCategory]);

  const handleCategoryClick = (category: string) => {
    updateUiState({ activeCategory: category });
    sectionRefs.current[category]?.scrollIntoView({ behavior: "smooth", block: "start" });
    chipRefs.current[category]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream py-8 dark:bg-gray-900">
        <div className="container mx-auto px-3">
          <LoadingState rows={8} label="در حال بارگذاری منو…" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-3 py-10">
        <ErrorState message={error?.message} onRetry={refetch} />
      </div>
    );
  }

  return (
    <>
      {/* Modal سبد خرید موبایل */}
      {uiState.showCartModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center lg:hidden">
          <div
            className="absolute inset-0 animate-fade-in bg-ink/40 backdrop-blur-sm"
            onClick={() => updateUiState({ showCartModal: false })}
          />
          <div className="relative max-h-[88vh] w-full animate-slide-up overflow-y-auto rounded-t-3xl bg-white p-3 shadow-lift dark:bg-gray-800 sm:max-w-md">
            <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-gray-200 dark:bg-gray-600" />
            <button
              type="button"
              onClick={() => updateUiState({ showCartModal: false })}
              aria-label="بستن سبد خرید"
              className="absolute end-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/15"
            >
              <FaTimes className="h-3.5 w-3.5" />
            </button>
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

      {/* Modal رزرو میز */}
      {showReservationModal && restaurant && (
        <ReservationModal restaurant={restaurant} onClose={() => setShowReservationModal(false)} />
      )}

      <div className="min-h-screen bg-cream pb-24 font-vazirmatn dark:bg-gray-900 lg:pb-8">
        {/* سربرگ رستوران */}
        {restaurant && (
          <div className="container mx-auto px-3 pt-3">
            <header className="relative overflow-hidden rounded-3xl bg-gradient-to-bl from-primary-500 via-primary-600 to-accent text-white shadow-lift">
              <span className="pointer-events-none absolute -left-10 -top-12 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
              <span className="pointer-events-none absolute -bottom-16 left-1/3 h-44 w-44 rounded-full bg-black/15 blur-2xl" />
              <div className="relative flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
                <div className="flex min-w-0 items-center gap-4">
                  <CoverArt
                    name={restaurant.name}
                    src={restaurant.image}
                    className="h-16 w-16 shrink-0 rounded-2xl ring-2 ring-white/40 sm:h-20 sm:w-20"
                    textClass="text-3xl"
                  />
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold tracking-widest text-white/70">منوی</p>
                    <h1 className="truncate font-vazirmatn-title text-lg font-bold sm:text-2xl">
                      {restaurant.name}
                    </h1>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-white/85">
                      <FaMapMarkerAlt className="shrink-0" />
                      <span className="truncate">{`${restaurant.address?.city || ''}, ${restaurant.address?.street || ''}`}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {restaurant.description && (
                    <p className="hidden max-w-[42ch] text-xs leading-relaxed text-white/85 xl:block">
                      {restaurant.description}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowReservationModal(true)}
                    className="ms-auto flex shrink-0 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-bold text-primary-700 shadow-card transition-all duration-200 hover:bg-primary-50 active:scale-[.97]"
                  >
                    <FaTable className="text-xs" />
                    رزرو میز
                  </button>
                </div>
              </div>
              {restaurant.description && (
                <p className="relative border-t border-white/20 px-4 py-2.5 text-xs leading-relaxed text-white/90 xl:hidden">
                  {restaurant.description}
                </p>
              )}
            </header>
          </div>
        )}

        <div className="container mx-auto flex flex-col gap-4 p-3 lg:flex-row lg:items-start lg:gap-5">
          {/* ستون راست: فهرست دسته‌ها */}
          <aside className="hidden w-[19rem] shrink-0 xl:block">
            <div className="sticky top-16 space-y-3 md:top-14">
              <Panel className="p-2">
                <p className="px-2 py-1.5 text-[11px] font-bold tracking-widest text-gray-400">
                  دسته‌ها
                </p>
                {categories.length > 0 ? (
                  <ul className="space-y-1">
                    {categories.map((category) => (
                      <li key={category}>
                        <button
                          onClick={() => handleCategoryClick(category)}
                          className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-right text-sm font-medium transition-all duration-200 ${
                            uiState.activeCategory === category
                              ? "bg-primary-50 text-primary-800 dark:bg-primary-500/15 dark:text-primary-200"
                              : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/60"
                          }`}
                        >
                          <span
                            className={`h-5 w-1 rounded-full transition-all duration-200 ${
                              uiState.activeCategory === category ? "bg-primary" : "bg-transparent"
                            }`}
                          ></span>
                          <span className="flex-1 truncate">{category}</span>
                          <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-bold text-gray-500 dark:bg-gray-900/50 dark:text-gray-400">
                            {toPersianNumber(groupedEdibles[category].length)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="px-3 py-4 text-center text-xs text-gray-500">دسته‌ای برای نمایش نیست.</p>
                )}
              </Panel>

              {itemCount > 0 && (
                <Panel className="animate-fade-up p-3">
                  <p className="flex items-center justify-between text-xs font-bold text-gray-600 dark:text-gray-300">
                    <span>سبد شما</span>
                    <span className="text-primary-700 dark:text-primary-300">
                      {toPersianNumber(itemCount)} قلم
                    </span>
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary-800 dark:text-primary-200">
                    {toPersianNumber(payable.toLocaleString())}
                    <span className="ms-1 text-xs font-normal text-gray-500 dark:text-gray-400">تومان</span>
                  </p>
                  {cartSummary.totalDiscount > 0 && (
                    <p className="mt-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {toPersianNumber(cartSummary.totalDiscount.toLocaleString())} تومان تخفیف گرفتی
                    </p>
                  )}
                  <Button className="mt-3 w-full" onClick={() => updateUiState({ showCartModal: true })}>
                    مشاهده سبد
                  </Button>
                </Panel>
              )}
            </div>
          </aside>

          {/* ستون وسط: منو */}
          <main className="min-w-0 flex-1">
            {/* نوار دسته‌ها برای موبایل و تبلت */}
            {categories.length > 0 && (
              <div className="sticky top-14 z-20 -mx-3 mb-4 overflow-x-auto bg-cream/90 px-3 py-2 backdrop-blur md:top-12 xl:hidden">
                <div className="flex gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      ref={(el) => {
                        chipRefs.current[category] = el;
                      }}
                      onClick={() => handleCategoryClick(category)}
                      className={`shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all duration-200 ${
                        uiState.activeCategory === category
                          ? "border-primary bg-primary text-white shadow-card"
                          : "border-gray-200 bg-white text-gray-600 hover:border-primary-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {categories.length > 0 ? (
              Object.entries(groupedEdibles).map(([type, edibles]) => (
                <section
                  key={type}
                  id={type}
                  className="mb-8 scroll-mt-28"
                  ref={(el) => {
                    sectionRefs.current[type] = el;
                  }}
                >
                  <div className="mb-4 flex items-center gap-2.5">
                    <h2 className="font-vazirmatn-title text-base font-bold text-gray-800 dark:text-white sm:text-lg">
                      {type}
                    </h2>
                    <span className="rounded-full bg-primary-50 px-2 py-0.5 text-[11px] font-bold text-primary-700 dark:bg-primary-500/15 dark:text-primary-200">
                      {toPersianNumber(edibles.length)}
                    </span>
                    <span className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
              <EmptyState
                icon={<FaUtensils />}
                title="موردی برای نمایش در منو وجود ندارد"
                hint={
                  uiState.searchQuery
                    ? `چیزی با «${uiState.searchQuery}» در این منو پیدا نشد.`
                    : "این رستوران هنوز خوراکی فعالی در منو ندارد."
                }
                action={
                  uiState.searchQuery ? (
                    <Button tone="neutral" variant="outline" onClick={() => updateUiState({ searchQuery: '' })}>
                      پاک کردن جستجو
                    </Button>
                  ) : undefined
                }
              />
            )}
          </main>

          {/* ستون چپ: سبد خرید */}
          <aside className="sticky top-16 hidden w-[21rem] shrink-0 self-start md:top-14 lg:block">
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
      </div>

      {/* نوار پایین موبایل */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-white/95 px-3 py-3 shadow-lift backdrop-blur lg:hidden dark:border-gray-700 dark:bg-gray-800/95">
        <button
          type="button"
          onClick={() => updateUiState({ showCartModal: true })}
          className={`flex w-full items-center justify-between gap-3 rounded-2xl px-4 py-2.5 text-white shadow-card transition-all duration-200 active:scale-[.98] ${
            itemCount > 0
              ? "bg-gradient-to-l from-primary-500 to-primary-600"
              : "bg-gray-400 dark:bg-gray-600"
          }`}
        >
          <span className="flex items-center gap-2 text-sm font-bold">
            <FaShoppingBasket className="h-3.5 w-3.5" />
            {itemCount > 0 ? `${toPersianNumber(itemCount)} قلم` : "سبد خرید خالی"}
          </span>
          {itemCount > 0 && (
            <span className="text-sm font-bold">{toPersianNumber(payable.toLocaleString())} تومان</span>
          )}
          <span className="text-xs font-bold opacity-90">مشاهده سبد</span>
        </button>
      </div>

      {/* مودال تایید نهایی سفارش */}
      {showOrderConfirmModal && customer && (
        <Modal
          title="تایید اطلاعات سفارش"
          width="md"
          onClose={() => setShowOrderConfirmModal(false)}
          footer={
            <>
              <Button tone="neutral" variant="outline" onClick={() => setShowOrderConfirmModal(false)}>
                انصراف
              </Button>
              <Button onClick={handleFinalOrderSubmit} disabled={createOrder.isPending}>
                {createOrder.isPending ? 'در حال ثبت...' : 'ثبت سفارش'}
              </Button>
            </>
          }
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-bl from-primary-500 to-primary-600 p-3 text-white shadow-card">
              <CoverArt
                name={restaurant?.name || 'زودمیز'}
                src={restaurant?.image}
                className="h-12 w-12 shrink-0 rounded-xl ring-2 ring-white/40"
                textClass="text-xl"
              />
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{restaurant?.name}</p>
                <p className="text-[11px] text-white/85">
                  میز {tableNumberToLabel(table || '')} · {toPersianNumber(itemCount)} قلم
                </p>
              </div>
            </div>

            <div>
              <InfoRow
                label="مشتری"
                value={`${customer.name || ''} ${customer.lastName || ''}`.trim() || '—'}
              />
              <InfoRow
                label="شماره تماس"
                value={toPersianNumber((customer.phone || userState.phone || '').replace(/[^0-9]/g, ''))}
              />
              <InfoRow label="شماره میز" value={tableNumberToLabel(table || '')} />
              <InfoRow label="جمع کل" value={`${toPersianNumber(cartSummary.totalOriginalPrice.toLocaleString())} تومان`} />
              {cartSummary.totalDiscount > 0 && (
                <InfoRow
                  label="تخفیف"
                  value={`${toPersianNumber(cartSummary.totalDiscount.toLocaleString())} تومان`}
                />
              )}
              <InfoRow label="قابل پرداخت" value={`${toPersianNumber(payable.toLocaleString())} تومان`} highlight />
              {uiState.notesInput && <InfoRow label="توضیحات" value={uiState.notesInput} />}
            </div>

            {createOrder.isError && (
              <p className="rounded-xl border-e-4 border-rose-500 bg-rose-50/80 px-3 py-2 text-xs font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">
                ثبت سفارش انجام نشد؛ دوباره تلاش کنید.
              </p>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default Menu;
