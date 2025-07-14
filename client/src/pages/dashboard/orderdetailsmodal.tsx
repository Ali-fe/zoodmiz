import React, { useRef, useMemo } from 'react';
import { FaTimes, FaPrint } from 'react-icons/fa';
import { toPersianNumber, tableNumberToLabel } from '../../utils/persianNumbers';
import { useReactToPrint } from 'react-to-print';
import { Order } from '../../hooks/useOrders';
import { orderStatus } from '../../types/order';

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
    `
  });

  // محاسبات مبلغ کل، تخفیف و پرداختی
  const { totalPrice, totalDiscount, payable, hasDiscount } = useMemo(() => {
    const totalPrice = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const totalDiscount = order.items.reduce((sum, item) => sum + Math.round(item.price * item.quantity * (item.discount / 100)), 0);
    const payable = totalPrice - totalDiscount;
    const hasDiscount = order.items.some(item => item.discount > 0);
    return { totalPrice, totalDiscount, payable, hasDiscount };
  }, [order.items]);

  // رندر ردیف جدول آیتم
  const renderItemRow = (item: any, idx: number) => {
    const itemPrice = item.price * item.quantity;
    const discountAmount = Math.round(itemPrice * (item.discount / 100));
    const total = itemPrice - discountAmount;
    return (
      <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
        <td className="py-1 px-2 border-b text-center">{toPersianNumber((idx+1).toString())}</td>
        <td className="py-1 px-2 border-b text-center font-semibold">{item.name}</td>
        <td className="py-1 px-2 border-b text-center">{toPersianNumber(item.quantity.toString())}</td>
        <td className="py-1 px-2 border-b text-center">{toPersianNumber(item.price.toLocaleString())}</td>
        <td className="py-1 px-2 border-b text-center font-bold">{toPersianNumber(total.toLocaleString())}</td>
      </tr>
    );
  };

  // اطلاعات سفارش
  const orderInfo = [
    { label: 'مشتری', value: order.customerName },
    order.customerPhone ? { label: 'شماره تماس', value: order.customerPhone } : null,
    { label: 'شماره میز', value: tableNumberToLabel(order.table) },
    { label: 'وضعیت', value: orderStatus[order.status] },
    { label: 'زمان', value: new Date(order.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }) },
    order.notes ? { label: 'یادداشت', value: order.notes } : null,
  ].filter(Boolean);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white text-black rounded-lg p-4 shadow-lg flex flex-col items-center w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center w-full mb-4">
          <div className="flex-1 flex justify-center">
            <h2 className="text-lg font-bold text-gray-900 text-center">
              سفارش شماره {toPersianNumber(order._id?.slice(-5) || '')}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors">
            <FaTimes />
          </button>
        </div>
        <div ref={printableRef} className="printable-content w-full">
          <div className="mb-2 text-center">
            {orderInfo.map((info, i) => (
              <p key={i} className="text-sm{info.label === 'مشتری' ? ' font-semibold' : ''}">{info.label}: {info.value}</p>
            ))}
          </div>
          <div className="overflow-x-auto mb-2">
            <table className="mx-auto min-w-[320px] max-w-[420px] border rounded-lg text-[11px]">
              <thead>
                <tr className="bg-gray-100 text-gray-800 text-center">
                  <th className="py-1 px-2 font-bold border-b text-center">#</th>
                  <th className="py-1 px-2 font-bold border-b text-center">نام آیتم</th>
                  <th className="py-1 px-2 font-bold border-b text-center">تعداد</th>
                  <th className="py-1 px-2 font-bold border-b text-center">قیمت واحد</th>
                  <th className="py-1 px-2 font-bold border-b text-center">جمع</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(renderItemRow)}
              </tbody>
            </table>
            <div className="mt-2 text-center text-[12px] font-bold">
              <div>مجموع : {toPersianNumber(totalPrice.toLocaleString())} تومان</div>
              {hasDiscount && <div className="text-red-500">تخفیف : {toPersianNumber(totalDiscount.toLocaleString())} تومان</div>}
              <div className="text-green-700">قابل پرداخت: {toPersianNumber(payable.toLocaleString())} تومان</div>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center flex gap-x-2 no-print">
          <button onClick={onClose} className="text-sm px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
            بستن
          </button>
          <button onClick={handlePrint} className="flex items-center gap-x-1 text-sm px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
            <FaPrint />
            چاپ
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal; 