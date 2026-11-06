import { useState, useMemo, useEffect } from 'react';
import { FaUtensils, FaWallet } from 'react-icons/fa';
import { useMenu } from '../../hooks/useEdibles';
import Edible from '../../types/edible';
import MenuItem from '../../components/menuitem';
import Cart from '../../components/cart';
import { useDashboardContext } from './dashboard';
import { useCreateOrder, useUpdateOrder } from '../../hooks/useOrders';
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
} from '../../components/dashboard/ui';
import { TextInput, SelectInput } from '../../components/dashboard/inputs';
import { toPersianNumber, tableNumberToLabel } from '../../utils/persianNumbers';
import { useTables } from '../../hooks/useTables';
import { redirect } from 'react-router-dom';

const Menu = () => {
  const { data: edibles = [], isLoading, isError, error, refetch } = useMenu();
  const { data: tables = [] } = useTables();
  const { searchQuery, cart, setCart, editingOrder, setEditingOrder } = useDashboardContext();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    table: -1,
    notesInput: '',
  });

  const resetForm = () =>
    setFormData({ customerName: '', customerPhone: '', table: -1, notesInput: '' });

  // مقداردهی اولیه فرم و سبد فقط یک‌بار هنگام ویرایش سفارش
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  useEffect(() => {
    if (editingOrder && edibles.length > 0) {
      setCart(
        editingOrder.items.map((item) => {
          const edible = edibles.find((e) => e._id === item.edible);
          return edible
            ? { ...edible, quantity: item.quantity, discount: item.discount }
            : {
                _id: item.edible,
                name: item.name,
                price: item.price,
                description: '',
                type: '',
                menu: true,
                available: true,
                discount: item.discount,
                quantity: item.quantity,
              };
        })
      );
      setFormData({
        customerName: editingOrder.customerName || '',
        customerPhone: editingOrder.customerPhone || '',
        table: editingOrder.table,
        notesInput: editingOrder.notes || '',
      });

      setEditingOrderId(editingOrder._id);
      setEditingOrder(null);
    }
    // eslint-disable-next-line
  }, [editingOrder, edibles]);

  const { mutate: createOrder, isPending: isSubmittingCreate } = useCreateOrder(() => {
    setShowModal(false);
    resetForm();
    setCart([]);
  });
  const { mutate: updateOrder, isPending: isSubmittingUpdate } = useUpdateOrder(() => {
    setShowModal(false);
    resetForm();
    setCart([]);
  });
  const isSubmitting = isSubmittingCreate || isSubmittingUpdate;

  const groupedEdibles = useMemo(() => {
    const filtered = edibles.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return filtered.reduce((acc: Record<string, Edible[]>, edible) => {
      const { type } = edible;
      if (!acc[type]) acc[type] = [];
      acc[type].push(edible);
      return acc;
    }, {});
  }, [edibles, searchQuery]);

  const categories = useMemo(
    () =>
      Object.entries(groupedEdibles).map(([type, items]) => ({
        type,
        slug: `cat-${encodeURIComponent(type)}`,
        count: items.length,
      })),
    [groupedEdibles]
  );

  const cartSummary = useMemo(
    () =>
      cart.reduce(
        (summary, item) => {
          const originalPrice = item.price * item.quantity;
          summary.totalOriginalPrice += originalPrice;
          summary.totalDiscount += Math.round(originalPrice * (item.discount / 100));
          return summary;
        },
        { totalOriginalPrice: 0, totalDiscount: 0 }
      ),
    [cart]
  );

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
          item._id === itemId ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleCancelEdit = () => {
    setShowModal(false);
    if (editingOrderId) {
      setEditingOrderId(null);
      setCart([]);
      resetForm();
    }
  };

  const handleRegisterOrder = (event: React.FormEvent) => {
    event.preventDefault();
    const orderData = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      table: Number(formData.table),
      notes: formData.notesInput,
      items: cart.map((item) => ({
        edible: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        discount: item.discount,
      })),
    };
    if (editingOrderId) {
      updateOrder({ id: editingOrderId, data: orderData });
      setEditingOrderId(null);
    } else {
      createOrder(orderData);
    }
    redirect('/dashboard/orders');
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <LoadingState rows={6} label="در حال بارگذاری منو…" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <ErrorState message={error?.message} onRetry={() => refetch()} />
      </div>
    );
  }

  const payable = cartSummary.totalOriginalPrice - cartSummary.totalDiscount;

  return (
    <div className="flex h-full flex-col gap-3 p-3 lg:flex-row">
      <div className="min-w-0 flex-1 overflow-y-auto">
        {editingOrderId && (
          <div className="mb-3 flex flex-wrap items-center gap-3 rounded-2xl border border-primary-200 bg-primary-50/70 px-4 py-3 dark:border-primary-500/30 dark:bg-primary-500/10">
            <span className="text-sm font-bold text-primary-800 dark:text-primary-200">
              در حال ویرایش سفارش هستید
            </span>
            <span className="text-xs text-primary-700/80 dark:text-primary-200/70">
              تغییرات فقط با «ثبت ویرایش» ذخیره می‌شود.
            </span>
            <Button tone="neutral" variant="outline" className="ms-auto" onClick={handleCancelEdit}>
              لغو ویرایش
            </Button>
          </div>
        )}

        {categories.length > 1 && (
          <nav
            aria-label="دسته‌های منو"
            className="sticky top-0 z-10 -mx-1 mb-3 flex gap-1.5 overflow-x-auto bg-cream/85 px-1 py-2 backdrop-blur dark:bg-gray-900/85"
          >
            {categories.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() =>
                  document
                    .getElementById(category.slug)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-bold text-gray-600 transition-all duration-200 hover:border-primary-300 hover:text-primary-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                {category.type}
                <span className="rounded-full bg-primary-50 px-1.5 text-[10px] text-primary-700 dark:bg-primary-500/20 dark:text-primary-200">
                  {toPersianNumber(category.count)}
                </span>
              </button>
            ))}
          </nav>
        )}

        {categories.length > 0 ? (
          categories.map((category) => (
            <section key={category.slug} id={category.slug} className="mb-6 scroll-mt-14">
              <div className="mb-2.5 flex items-center gap-2">
                <span className="h-4 w-1.5 rounded-full bg-gradient-to-b from-primary-400 to-primary-600" />
                <h2 className="text-sm font-bold text-gray-800 dark:text-white font-vazirmatn-title">
                  {category.type}
                </h2>
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  {toPersianNumber(category.count)} آیتم
                </span>
              </div>
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                {groupedEdibles[category.type].map((item) => (
                  <MenuItem
                    key={item._id}
                    item={item}
                    count={cart.find((c) => c._id === item._id)?.quantity || 0}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={(clicked) => handleUpdateQuantity(clicked._id, -1)}
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
              searchQuery
                ? `با فیلتر «${searchQuery}» چیزی پیدا نشد.`
                : 'از بخش خوراکی‌ها آیتم تازه اضافه کنید.'
            }
          />
        )}
      </div>

      <aside className="w-full shrink-0 lg:w-[340px]">
        <Cart
          cart={cart}
          cartSummary={cartSummary}
          handleAddToCart={handleAddToCart}
          handleUpdateQuantity={handleUpdateQuantity}
          handleClearCart={() => setCart([])}
          notesInput={formData.notesInput}
          setNotesInput={(value) => setFormData({ ...formData, notesInput: value })}
          onSubmitOrder={() => setShowModal(true)}
        />
      </aside>

      {/* موبایل: نوار جمع سبد */}
      {cart.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-gray-100 bg-white/95 px-4 py-3 backdrop-blur lg:hidden dark:border-gray-700 dark:bg-gray-800/95">
          <div className="flex items-center justify-between gap-3">
            <span className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300">
              <FaWallet className="h-3.5 w-3.5 text-primary-500" />
              {toPersianNumber(cart.length)} آیتم ·{' '}
              {toPersianNumber(payable.toLocaleString())} تومان
            </span>
            <Button onClick={() => setShowModal(true)}>ثبت سفارش</Button>
          </div>
        </div>
      )}

      {showModal && (
        <Modal
          title={editingOrderId ? 'ویرایش سفارش' : 'ثبت اطلاعات سفارش'}
          onClose={() => setShowModal(false)}
          width="sm"
        >
          <form onSubmit={handleRegisterOrder} id="order-info-form" className="space-y-4">
            <TextInput
              label="نام مشتری"
              name="customerName"
              type="text"
              value={formData.customerName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              required
            />
            <TextInput
              label="شماره تماس"
              name="customerPhone"
              type="text"
              value={formData.customerPhone}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFormData({ ...formData, customerPhone: e.target.value })
              }
              className="text-left"
              dir="ltr"
            />
            <SelectInput
              label="شماره میز"
              name="tableNumber"
              value={formData.table}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setFormData({ ...formData, table: Number(e.target.value) })
              }
              required
            >
              <option value="-1">انتخاب میز</option>
              <option value="0">{tableNumberToLabel(0)}</option>
              {tables
                .filter((table) => table.status === 'available')
                .map((table) => (
                  <option key={table._id} value={table.numeral}>
                    میز {tableNumberToLabel(table.numeral)} (ظرفیت: {toPersianNumber(table.capacity)} نفر)
                  </option>
                ))}
            </SelectInput>

            <div className="flex items-center justify-between gap-2 rounded-xl bg-gray-50 px-3 py-2 dark:bg-gray-900/40">
              <span className="text-xs text-gray-500 dark:text-gray-400">قابل پرداخت</span>
              <span className="text-sm font-bold text-primary-700 dark:text-primary-200">
                {toPersianNumber(payable.toLocaleString())} تومان
              </span>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button tone="neutral" variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
                {editingOrderId ? 'لغو ویرایش' : 'انصراف'}
              </Button>
              <Button type="submit" tone="success" disabled={isSubmitting}>
                {isSubmitting
                  ? editingOrderId
                    ? 'در حال ثبت ویرایش…'
                    : 'در حال ثبت…'
                  : editingOrderId
                    ? 'ثبت ویرایش'
                    : 'ثبت سفارش'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Menu;
