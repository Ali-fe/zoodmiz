import React, { useRef, useMemo } from 'react';
import { FaPrint, FaWallet } from 'react-icons/fa';
import { toPersianNumber, tableNumberToLabel } from '../../utils/persianNumbers';
import { useReactToPrint } from 'react-to-print';
import { Button, Modal } from '../../components/dashboard/ui';
import { formatJalaliDateTime } from '../../utils/geo';
import { Order } from '../../hooks/useOrders';

interface Props {
  order: Order;
  onClose: () => void;
}

const OrderDetailsModal: React.FC<Props> = ({ order, onClose }) => {
  const printableRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printableRef,
    documentTitle: `سفارش-${order._id}`,
    pageStyle: `
      @media print {
        @page { margin: 0.3in; size: A5 portrait; }
        body { margin: 0; padding: 0; font-size: 13px; direction: rtl; }
        .no-print { display: none !important; }
        .printable-content { page-break-inside: avoid; break-inside: avoid; width: 100%; max-width: none; margin: 0; padding: 10px; direction: rtl; text-align: center; }
        .printable-content * { box-sizing: border-box; }
        .printable-content table { width: 100%; border-collapse: collapse; }
        .printable-content th, .printable-content td { border: 1px solid #ddd; padding: 4px; }
      }
    `,
  });

  const { totalPrice, totalDiscount, payable, hasDiscount } = useMemo(() => {
    const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiscount = order.items.reduce(
      (sum, item) => sum + Math.round(item.price * item.quantity * (item.discount / 100)),
      0
    );
    return {
      totalPrice,
      totalDiscount,
      payable: totalPrice - totalDiscount,
      hasDiscount: order.items.some((item) => item.discount > 0),
    };
  }, [order.items]);

  const infoRows = [
    { label: 'مشتری', value: order.customerName },
    order.customerPhone ? { label: 'تماس', value: toPersianNumber(order.customerPhone) } : null,
    { label: 'میز', value: tableNumberToLabel(order.table) },
    { label: 'زمان', value: formatJalaliDateTime(order.createdAt) },
    order.notes ? { label: 'توضیحات', value: order.notes } : null,
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <Modal
      title={`فاکتور سفارش ${toPersianNumber(String(order._id).slice(-5))}`}
      onClose={onClose}
      width="md"
      footer={
        <>
          <Button tone="neutral" variant="outline" onClick={onClose}>
            بستن
          </Button>
          <Button icon={<FaPrint />} onClick={handlePrint}>
            چاپ فاکتور
          </Button>
        </>
      }
    >
      <div ref={printableRef} className="printable-content mx-auto max-w-md rounded-xl bg-white p-4 text-black ring-1 ring-gray-100">
        {/* سربرگ فاکتور */}
        <div className="mb-3 rounded-lg bg-gradient-to-l from-primary-500 to-primary-600 px-3 py-2.5 text-center text-white">
          <p className="text-sm font-bold font-vazirmatn-title">فاکتور سفارش</p>
          <p className="mt-0.5 text-[11px] opacity-90">
            شماره {toPersianNumber(String(order._id).slice(-5))} · {formatJalaliDateTime(order.createdAt)}
          </p>
        </div>

        <dl className="mb-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
          {infoRows.map((info) => (
            <div
              key={info.label}
              className={`flex items-baseline justify-between gap-2 border-b border-dashed border-gray-200 pb-1 ${
                info.label === 'توضیحات' ? 'col-span-2' : ''
              }`}
            >
              <dt className="shrink-0 text-gray-500">{info.label}</dt>
              <dd className="truncate font-bold text-gray-900">{info.value}</dd>
            </div>
          ))}
        </dl>

        <table className="w-full border rounded-lg text-[11px]">
          <thead>
            <tr className="bg-gray-100 text-gray-800">
              <th className="px-2 py-1 font-bold border-b">#</th>
              <th className="px-2 py-1 font-bold border-b">نام آیتم</th>
              <th className="px-2 py-1 font-bold border-b">تعداد</th>
              <th className="px-2 py-1 font-bold border-b">قیمت واحد</th>
              <th className="px-2 py-1 font-bold border-b">جمع</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item, idx) => {
              const itemPrice = item.price * item.quantity;
              const discountAmount = Math.round(itemPrice * (item.discount / 100));
              return (
                <tr key={`${item.name}-${idx}`} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="px-2 py-1 border-b text-center">{toPersianNumber(idx + 1)}</td>
                  <td className="px-2 py-1 border-b text-center font-semibold">{item.name}</td>
                  <td className="px-2 py-1 border-b text-center">{toPersianNumber(item.quantity)}</td>
                  <td className="px-2 py-1 border-b text-center">{toPersianNumber(item.price.toLocaleString())}</td>
                  <td className="px-2 py-1 border-b text-center font-bold">
                    {toPersianNumber((itemPrice - discountAmount).toLocaleString())}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="mt-3 space-y-1 text-[12px]">
          <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-1">
            <span className="text-gray-500">مجموع</span>
            <span className="font-bold">{toPersianNumber(totalPrice.toLocaleString())} تومان</span>
          </div>
          {hasDiscount && (
            <div className="flex items-center justify-between border-b border-dashed border-gray-200 pb-1 text-rose-600">
              <span>تخفیف</span>
              <span className="font-bold">{toPersianNumber(totalDiscount.toLocaleString())} تومان</span>
            </div>
          )}
          <div className="mt-1 flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 font-bold text-emerald-700">
            <span className="inline-flex items-center gap-1.5">
              <FaWallet className="h-3 w-3" />
              قابل پرداخت
            </span>
            <span>{toPersianNumber(payable.toLocaleString())} تومان</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderDetailsModal;
