import { useState, useMemo, useEffect } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef, getSortedRowModel, SortingState } from '@tanstack/react-table';
import { FaEdit, FaPause, FaPlay, FaPlus, FaSpinner, FaTrash, FaUtensils } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useDashboardContext } from './dashboard';
import { edibleType } from '../../data/data';
import { toPersianNumber } from '../../utils/persianNumbers';
import Edible from '../../types/edible';
import CoverArt from '../../components/coverart';
import { useEdibles , useToggleMenu , useDeleteEdible} from '../../hooks/useEdibles';
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
  TablePager,
  TableWrap,
  Td,
  Th,
  Tr,
} from '../../components/dashboard/ui';

const PAGE_SIZE = 12;

const Edibles = () => {
  const { searchQuery } = useDashboardContext();
  const navigate = useNavigate();
  const [deleteTarget, setDeleteTarget] = useState<Edible | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'type', desc: false }]);

  const { data: allEdibles = [], isLoading, isError, error, refetch } = useEdibles();
  const { mutate: toggleMenu, isPending: isMenuing } = useToggleMenu();
  const { mutate: deleteEdible } = useDeleteEdible(() => {
    setDeleteTarget(null);
  });

  const filteredEdibles = useMemo(() => {
    let result = allEdibles;
    if (typeFilter) result = result.filter(e => e.type === typeFilter);
    if (searchQuery) result = result.filter(e =>
      e.name.includes(searchQuery) ||
       e.description.includes(searchQuery)
      );
    return result;
  }, [allEdibles, typeFilter, searchQuery]);

  useEffect(() => {
    setPage(0);
  }, [typeFilter, searchQuery]);

  const pagedEdibles = useMemo(
    () => filteredEdibles.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [filteredEdibles, page]
  );

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteEdible(deleteTarget._id);
  };

  const handleToggleMenu = (edible: Edible) => {
    toggleMenu({ edibleId: edible._id, menu: edible.menu });
  };

  const columns = useMemo<ColumnDef<Edible, any>[]>
    (
      () => [
        {
          header: 'نوع',
          accessorKey: 'type',
          cell: ({ getValue }: { getValue: () => string }) => <Badge tone="primary">{getValue()}</Badge>,
        },
        {
          header: 'تصویر',
          accessorKey: 'imageURL',
          enableSorting: false,
          cell: ({ getValue, row }: { getValue: () => string, row: any }) => (
            <CoverArt
              name={row.original.name}
              src={getValue()}
              className="mx-auto h-11 w-11 rounded-xl"
              textClass="text-sm"
            />
          ),
        },
        {
          header: 'نام',
          accessorKey: 'name',
          cell: ({ getValue }: { getValue: () => string }) => (
            <span className="text-sm font-bold text-gray-800 dark:text-gray-100">{getValue()}</span>
          ),
        },
        {
          header: 'توضیحات',
          accessorKey: 'description',
          enableSorting: false,
          cell: ({ getValue }: { getValue: () => string }) => (
            <span className="block max-w-[220px] truncate text-xs text-gray-500 dark:text-gray-400">
              {getValue() || '—'}
            </span>
          ),
        },
        {
          header: 'قیمت (تومان)',
          accessorKey: 'price',
          cell: ({ getValue }: { getValue: () => number }) => (
            <span className="text-sm font-bold text-primary-700 tabular-nums dark:text-primary-300">
              {toPersianNumber(Number(getValue()).toLocaleString())}
            </span>
          ),
        },
        {
          header: 'تخفیف',
          accessorKey: 'discount',
          cell: ({ getValue }: { getValue: () => number }) => {
            const discount = Number(getValue());
            return discount > 0
              ? <Badge tone="danger">{toPersianNumber(discount)}٪</Badge>
              : <span className="text-xs text-gray-400">—</span>;
          },
        },
        {
          header: 'منو',
          accessorKey: 'menu',
          cell: ({ getValue }: { getValue: () => boolean }) =>
            getValue() ? <Badge tone="success">در منو</Badge> : <Badge tone="neutral">خارج از منو</Badge>,
        },
        {
          header: 'عملیات',
          id: 'actions',
          enableSorting: false,
          cell: ({ row }: { row: any }) => {
            const edible = row.original as Edible;
            const isInMenu = edible.menu;
            return (
              <div className="flex items-center justify-center gap-1.5">
                <IconButton tone="info" label="ویرایش" onClick={() => navigate(`/dashboard/edible/${edible._id}`)}>
                  <FaEdit />
                </IconButton>
                <IconButton tone="danger" label="حذف" onClick={() => setDeleteTarget(edible)}>
                  <FaTrash />
                </IconButton>
                <IconButton
                  tone={isInMenu ? 'warning' : 'success'}
                  label={isInMenu ? 'حذف از منو' : 'افزودن به منو'}
                  onClick={() => handleToggleMenu(edible)}
                  disabled={isMenuing}
                >
                  {isMenuing ? <FaSpinner className="animate-spin" /> : isInMenu ? <FaPause /> : <FaPlay />}
                </IconButton>
              </div>
            );
          },
        },
      ],
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [navigate, isMenuing]
    );

  const table = useReactTable<Edible>({
    data: pagedEdibles,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnFilters: true,
  });

  return (
    <div className="p-4">
      <PageHeader
        title="خوراکی‌ها"
        subtitle={`${toPersianNumber(filteredEdibles.length)} مورد${typeFilter ? ` در دسته ${typeFilter}` : ''}`}
        icon={<FaUtensils />}
        actions={
          <>
            <Segmented
              value={typeFilter}
              onChange={setTypeFilter}
              options={[{ value: '', label: 'همه' }, ...edibleType.map(type => ({ value: type, label: type }))]}
            />
            <Button icon={<FaPlus />} onClick={() => navigate('/dashboard/edible')}>
              افزودن
            </Button>
          </>
        }
      />

      {isLoading ? (
        <LoadingState rows={5} label="در حال دریافت خوراکی‌ها…" />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={() => void refetch()} />
      ) : filteredEdibles.length === 0 ? (
        <EmptyState
          title="موردی پیدا نشد"
          hint="با تغییر دسته یا عبارت جستجو دوباره امتحان کنید."
          action={
            <Button tone="primary" variant="outline" icon={<FaPlus />} onClick={() => navigate('/dashboard/edible')}>
              افزودن خوراکی جدید
            </Button>
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
                      <Td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</Td>
                    ))}
                  </Tr>
                ))}
              </tbody>
            </table>
          </TableWrap>
          <TablePager total={filteredEdibles.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      )}

      {deleteTarget && (
        <Modal
          title="تایید حذف خوراکی"
          onClose={() => setDeleteTarget(null)}
          footer={
            <>
              <Button tone="neutral" variant="outline" onClick={() => setDeleteTarget(null)}>
                انصراف
              </Button>
              <Button tone="danger" onClick={handleDelete}>حذف</Button>
            </>
          }
        >
          <div className="flex items-center gap-3">
            <CoverArt name={deleteTarget.name} src={deleteTarget.imageURL} className="h-14 w-14 flex-shrink-0 rounded-xl" />
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
              «{deleteTarget.name}» از لیست خوراکی‌ها حذف شود؟ این عمل قابل بازگشت نیست.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Edibles;
