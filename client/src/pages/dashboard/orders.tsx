import { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { FaSpinner, FaEdit, FaTrash, FaTimes, FaEye } from 'react-icons/fa';
import { useDashboardContext } from './dashboard';
import { useOrders ,useDeleteOrder } from '../../hooks/useOrders';
import { Order } from '../../hooks/useOrders';

const toPersianNumber = (input: number | string) => {
  return input.toString().replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[parseInt(d)]);
};

const orderStatus = {
  pending: 'در انتظار',
  preparing: 'در حال آماده‌سازی',
  ready: 'آماده',
  delivered: 'تحویل شده',
  cancelled: 'لغو شده'
};

const Orders = () => {
  const { isDarkTheme } = useDashboardContext();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; order: Order | null }>({
    isOpen: false,
    order: null
  });
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [search, setSearch] = useState('');

  const { data: allOrders = [], isLoading, isError, error } = useOrders();
  const { mutate: deleteOrder } = useDeleteOrder();
  const filteredOrders = useMemo(() => {
    let result = allOrders;
    if (statusFilter) result = result.filter(o => o.status === statusFilter);
    if (search) result = result.filter(o => 
      o.customerName.includes(search) || 
      o.customerPhone?.includes(search) || 
      o.table.includes(search)
    );
    return result;
  }, [allOrders, statusFilter, search]);

  const handleDelete = () => {
    if (!deleteModal.order) return;
    deleteOrder(deleteModal.order._id);
    setDeleteModal({ isOpen: false, order: null });
  };

  const calculateTotalPrice = (items: any[]) => {
    return items.reduce((total, item) => {
      const itemPrice = item.price * item.quantity;
      const discountAmount = Math.round(itemPrice * (item.discount / 100));
      return total + (itemPrice - discountAmount);
    }, 0);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const columns = useMemo<ColumnDef<Order, any>[]>(
    () => [
      {
        header: 'تاریخ سفارش',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => formatDate(getValue()),
      },
      {
        header: 'نام مشتری',
        accessorKey: 'customerName',
      },
      {
        header: 'شماره تماس',
        accessorKey: 'customerPhone',
        cell: ({ getValue }) => getValue() || '-',
      },
      {
        header: 'شماره میز',
        accessorKey: 'table',
      },
      {
        header: 'وضعیت',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const status = getValue();
          return (
            <span className={
              status === 'pending'
                ? 'text-yellow-500 font-bold'
                : status === 'preparing'
                  ? 'text-blue-500 font-bold'
                  : status === 'ready'
                    ? 'text-green-500 font-bold'
                    : status === 'delivered'
                      ? 'text-gray-500 font-bold'
                      : 'text-red-500 font-bold'
            }>
              {orderStatus[status as keyof typeof orderStatus]}
            </span>
          );
        },
      },
      {
        header: 'مبلغ کل (تومان)',
        accessorKey: 'items',
        cell: ({ getValue }) => {
          const items = getValue();
          const total = calculateTotalPrice(items);
          return toPersianNumber(total.toLocaleString());
        },
      },
      {
        header: 'عملیات',
        id: 'actions',
        cell: ({ row }: { row: any }) => {
          const order = row.original;
          return (
            <div className="flex items-center justify-center gap-2">
              <button
                title="مشاهده جزئیات"
                onClick={() => {/* TODO: Implement view order details */}}
                className={`p-1.5 rounded-md transition-colors duration-200 ${isDarkTheme
                  ? 'text-blue-400 hover:bg-blue-500/20'
                  : 'text-blue-600 hover:bg-blue-100'
                  }`}
              >
                <FaEye className="text-sm" />
              </button>
              <button
                title="ویرایش سفارش"
                onClick={() => {/* TODO: Implement edit order */}}
                className={`p-1.5 rounded-md transition-colors duration-200 ${isDarkTheme
                  ? 'text-green-400 hover:bg-green-500/20'
                  : 'text-green-600 hover:bg-green-100'
                  }`}
              >
                <FaEdit className="text-sm" />
              </button>
              <button
                title="حذف سفارش"
                onClick={() => setDeleteModal({ isOpen: true, order })}
                className={`p-1.5 rounded-md transition-colors duration-200 ${isDarkTheme
                  ? 'text-red-400 hover:bg-red-500/20'
                  : 'text-red-600 hover:bg-red-100'
                  }`}
              >
                <FaTrash className="text-sm" />
              </button>
            </div>
          );
        },
      },
    ],
    [isDarkTheme]
  );

  const table = useReactTable<Order>({
    data: filteredOrders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnFilters: true,
  });

  return (
    <div className={`p-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex items-center gap-10">
          <h1 className={`text-l font-bold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
            سفارشات
          </h1>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className={`px-2 py-1 rounded-md border text-sm ${isDarkTheme
              ? 'bg-gray-800 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
              }`}
          >
            <option value="">همه وضعیت‌ها</option>
            {Object.entries(orderStatus).map(([key, value]) => (
              <option key={key} value={key}>{value}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="جستجو بر اساس نام، شماره تماس یا میز..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={`px-3 py-1 rounded-md border text-sm ${isDarkTheme
              ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
              : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <FaSpinner className={`animate-spin text-3xl ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500 py-4">
          خطا در بارگذاری داده‌ها: {error?.message}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className={`min-w-full border rounded-lg ${isDarkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id} className={isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}>
                  {headerGroup.headers.map(header => (
                    <th
                      key={header.id}
                      className={`py-2 px-3 border-b text-center font-semibold text-sm ${isDarkTheme ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'}`}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map(row => (
                <tr key={row.id} className={isDarkTheme ? 'hover:bg-gray-700 border-gray-600' : 'hover:bg-gray-50 border-gray-200'}>
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="py-2 px-3 border-b text-sm text-center">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* مودال تایید حذف */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className={`rounded-lg shadow-lg p-4 max-w-sm w-full transition-all duration-300 overflow-hidden
              ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                تایید حذف
              </h2>
              <button
                onClick={() => setDeleteModal({ isOpen: false, order: null })}
                className={`p-2 rounded-md transition-colors duration-200 ${isDarkTheme
                  ? 'text-gray-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <FaTimes />
              </button>
            </div>
            <p className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
              آیا از حذف این سفارش اطمینان دارید؟ این عمل قابل بازگشت نیست.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteModal({ isOpen: false, order: null })}
                className={`px-3 py-1.5 text-sm rounded-md font-medium ${isDarkTheme
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-all duration-200`}
              >
                انصراف
              </button>
              <button
                onClick={handleDelete}
                className={`px-3 py-1.5 text-sm rounded-md font-medium ${isDarkTheme
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                  } transition-all duration-200`}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;