import { useState, useMemo, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef, getSortedRowModel, SortingState } from '@tanstack/react-table';
import { FaEdit, FaEye, FaShoppingCart, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDashboardContext } from './dashboard';
import { useOrders ,useDeleteOrder } from '../../hooks/useOrders';
import { Order } from '../../hooks/useOrders';
import { toPersianNumber, tableNumberToLabel } from '../../utils/persianNumbers';
import { orderStatus } from '../../types/order';
import OrderDetailsModal from './orderdetailsmodal';
import {
  Badge,
  Button,
  EmptyState,
  ErrorState,
  IconButton,
  LoadingState,
  Modal,
  PageHeader,
  Segmented,
  statusTone,
  TablePager,
  TableWrap,
  Td,
  Th,
  Tr,
} from '../../components/dashboard/ui';

const PAGE_SIZE = 12;

const Orders = () => {
  const { searchQuery, setEditingOrder } = useDashboardContext();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [detailsModal, setDetailsModal] = useState<{ open: boolean; order: Order | null }>({ open: false, order: null });

  const { data: allOrders = [], isLoading, isError, error, refetch } = useOrders();
  const { mutate: deleteOrder } = useDeleteOrder();
  const filteredOrders = useMemo(() => {
    let result = allOrders;
    if (statusFilter) result = result.filter(o => o.status === statusFilter);
    if (searchQuery) result = result.filter(o =>
      o.customerName.includes(searchQuery) ||
      o.table === Number(searchQuery)
    );
    return result;
  }, [allOrders, statusFilter, searchQuery]);

  useEffect(() => {
    setPage(0);
  }, [statusFilter, searchQuery]);

  const pagedOrders = useMemo(
    () => filteredOrders.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [filteredOrders, page]
  );

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteOrder(deleteTarget._id);
    setDeleteTarget(null);
  };

  const calculateTotalPrice = (items: any[]) => {
    return items.reduce((total, item) => {
      const itemPrice = item.price * item.quantity;
      const discountAmount = Math.round(itemPrice * (item.discount / 100));
      return total + (itemPrice - discountAmount);
    }, 0);
  };

  const formatDate = (dateString: string) => (
    <div dir="ltr" className="text-xs text-gray-600 dark:text-gray-300">
      {new Date(dateString).toLocaleDateString('fa-IR', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </div>
  );

  const columns = useMemo<ColumnDef<Order, any>[]>(
    () => [
      {
        header: 'تاریخ سفارش',
        accessorKey: 'createdAt',
        cell: ({ getValue }) => formatDate(getValue()),
        enableSorting: true,
      },
      {
        header: 'شماره میز',
        accessorKey: 'table',
        cell: ({ getValue }: { getValue: () => any }) => (
          <Badge tone="primary">{tableNumberToLabel(getValue())}</Badge>
        ),
      },
      {
        header: 'نام مشتری',
        accessorKey: 'customerName',
        cell: ({ getValue }) => (
          <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{getValue()}</span>
        ),
      },
      {
        header: 'وضعیت',
        accessorKey: 'status',
        cell: ({ getValue }) => (
          <Badge tone={statusTone(getValue())}>{orderStatus[getValue() as keyof typeof orderStatus]}</Badge>
        ),
      },
      {
        header: 'مبلغ کل (تومان)',
        accessorKey: 'items',
        cell: ({ getValue }) => {
          const total = calculateTotalPrice(getValue());
          return (
            <span className="text-sm font-bold text-primary-700 tabular-nums dark:text-primary-300">
              {toPersianNumber(total.toLocaleString())}
            </span>
          );
        },
      },
      {
        header: 'عملیات',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }: { row: any }) => {
          const order = row.original;
          return (
            <div className="flex items-center justify-center gap-1.5">
              <IconButton tone="info" label="مشاهده جزئیات" onClick={() => setDetailsModal({ open: true, order })}>
                <FaEye />
              </IconButton>
              <IconButton
                tone="success"
                label="ویرایش سفارش"
                onClick={() => {
                  setEditingOrder(order);
                  navigate('/dashboard/menu');
                }}
              >
                <FaEdit />
              </IconButton>
              <IconButton tone="danger" label="حذف سفارش" onClick={() => setDeleteTarget(order)}>
                <FaTrash />
              </IconButton>
            </div>
          );
        },
      },
    ],
    [navigate, setEditingOrder]
  );
const [sorting, setSorting] = useState<SortingState>([
  { id: 'createdAt', desc: true },
]);
  const table = useReactTable<Order>({
    data: pagedOrders,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
     getSortedRowModel: getSortedRowModel(),
    enableColumnFilters: true,
  });

  return (
    <div className="p-4">
      <PageHeader
        title="سفارشات"
        subtitle={`${toPersianNumber(filteredOrders.length)} سفارش${searchQuery ? ' با جستجوی شما' : ''}`}
        icon={<FaShoppingCart />}
        actions={
          <Segmented
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: '', label: 'همه' },
              ...Object.entries(orderStatus).map(([key, label]) => ({ value: key, label })),
            ]}
          />
        }
      />

      {isLoading ? (
        <LoadingState rows={5} label="در حال دریافت سفارشات…" />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={() => void refetch()} />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          title="سفارشی پیدا نشد"
          hint={
            searchQuery || statusFilter
              ? 'فیلترها یا عبارت جستجو را تغییر دهید.'
              : 'هنوز سفارشی برای این رستوران ثبت نشده است.'
          }
        />
      ) : (
        <div>
          <TableWrap>
            <table className="min-w-full">
              <thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <Th
                        key={header.id}
                        sorted={header.column.getIsSorted()}
                        onSort={header.column.getCanSort() ? header.column.getToggleSortingHandler() : undefined}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map(row => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map(cell => (
                      <Td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
          <TablePager total={filteredOrders.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      )}

      {deleteTarget && (
        <Modal
          title="تایید حذف سفارش"
          onClose={() => setDeleteTarget(null)}
          footer={
            <>
              <Button tone="neutral" variant="outline" onClick={() => setDeleteTarget(null)}>
                انصراف
              </Button>
              <Button tone="danger" onClick={handleDelete}>حذف سفارش</Button>
            </>
          }
        >
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            سفارش
            <span className="mx-1 font-bold text-gray-900 dark:text-white">
              {deleteTarget.customerName}
            </span>
            روی میز
            <span className="mx-1 font-bold text-gray-900 dark:text-white">
              {tableNumberToLabel(deleteTarget.table)}
            </span>
            حذف شود؟ این عمل قابل بازگشت نیست.
          </p>
        </Modal>
      )}
      {detailsModal.open && detailsModal.order && (
        <OrderDetailsModal
          order={detailsModal.order}
          onClose={() => setDetailsModal({ open: false, order: null })}
        />
      )}
    </div>
  );
};

export default Orders;
