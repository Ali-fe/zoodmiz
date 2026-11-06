import { useState, useMemo, useEffect, useRef, type ChangeEvent } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef, getSortedRowModel, SortingState } from '@tanstack/react-table';
import { FaEdit, FaExternalLinkAlt, FaPlus, FaPrint, FaQrcode, FaTable, FaTrash } from 'react-icons/fa';
import { useDashboardContext } from './dashboard';
import { useTables, useCreateTable, useDeleteTable, useUpdateTable } from '../../hooks/useTables';
import { Table } from '../../types/table';
import { QRCodeSVG } from 'qrcode.react';
import { tableStatus } from '../../data/data';
import { SelectInput, TextInput } from '../../components/dashboard/inputs';
import { useReactToPrint } from 'react-to-print';
import { toPersianNumber } from '../../utils/persianNumbers';
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
  statusTone,
  TableWrap,
  Td,
  Th,
  Tr,
} from '../../components/dashboard/ui';

const PAGE_SIZE = 12;

const Tables = () => {
  const { user ,searchQuery } = useDashboardContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [form, setForm] = useState({ numeral: '', capacity: '', status: 'available' });
  const [qrTable, setQrTable] = useState<Table | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Table | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [page, setPage] = useState(0);
  const [sorting, setSorting] = useState<SortingState>([{ id: 'numeral', desc: false }]);
  const printableRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printableRef,
    documentTitle: `QR-میز-${qrTable?.numeral}`,
    onAfterPrint: () => console.log('Print success'),
    pageStyle: `
      @media print {
        @page {
          margin: 0.3in;
          size: A8 portrait;
        }
        body {
          margin: 0;
          padding: 0;
          font-size: 12px;
          direction: rtl;
        }
        .no-print {
          display: none !important;
        }
        .printable-content {
          page-break-inside: avoid;
          break-inside: avoid;
          width: 100%;
          max-width: none;
          margin: 0;
          padding: 10px;
          direction: rtl;
          text-align: center;
        }
        .printable-content * {
          box-sizing: border-box;
        }
        .printable-content img {
          max-width: 100%;
          height: auto;
        }
        .printable-content svg {
          max-width: 100%;
          height: auto;
        }
        .printable-content ul {
          text-align: right;
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .printable-content li {
          text-align: center;
        }
      }
    `
  });

  const { data: allTables = [], isLoading, isError, error, refetch } = useTables();
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTable(null);
    setForm({ numeral: '', capacity: '', status: 'available' });
  };

  const { mutate: createTable, isPending: isCreating } = useCreateTable(closeModal);
  const { mutate: updateTable, isPending: isUpdating } = useUpdateTable(closeModal);
  const { mutate: deleteTable } = useDeleteTable(() => setDeleteTarget(null));

  useEffect(() => {
    if (editingTable) {
      setForm({
        numeral: editingTable.numeral.toString(),
        capacity: editingTable.capacity.toString(),
        status: editingTable.status,
      });
    }
  }, [editingTable]);

  const handleDelete = () => {
    if (!deleteTarget) return;
    deleteTable(deleteTarget._id);
  };

  const handleEditClick = (table: Table) => {
    setEditingTable(table);
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    setEditingTable(null);
    setForm({ numeral: '1', capacity: '2', status: 'available' });
    setIsModalOpen(true);
  };

  const filteredTables = useMemo(() => {
    let result = allTables;
    if (searchQuery) result = result.filter(t => t.numeral === Number(searchQuery));
    if (statusFilter) result = result.filter(t => t.status === statusFilter);
    return result;
  }, [allTables, searchQuery, statusFilter]);

  useEffect(() => {
    setPage(0);
  }, [statusFilter, searchQuery]);

  const pagedTables = useMemo(
    () => filteredTables.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE),
    [filteredTables, page]
  );

  const columns = useMemo<ColumnDef<Table, any>[]>(
    () => [
      {
        header: 'شماره',
        accessorKey: 'numeral',
        cell: ({ getValue }: { getValue: () => number }) => (
          <span className="text-sm font-bold text-gray-900 tabular-nums dark:text-white">
            میز {toPersianNumber(Number(getValue()).toLocaleString())}
          </span>
        ),
      },
      {
        header: 'ظرفیت',
        accessorKey: 'capacity',
        cell: ({ getValue }: { getValue: () => number }) => (
          <Badge tone="neutral">{toPersianNumber(Number(getValue()).toLocaleString())} نفر</Badge>
        ),
      },
      {
        header: 'وضعیت',
        accessorKey: 'status',
        cell: ({ getValue }: { getValue: () => string }) => {
          const status = getValue();
          return (
            <Badge tone={statusTone(status)}>
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  status === 'available'
                    ? 'bg-emerald-500'
                    : status === 'occupied'
                      ? 'bg-rose-500'
                      : 'bg-amber-500'
                }`}
              />
              {tableStatus[status as keyof typeof tableStatus]}
            </Badge>
          );
        },
      },
      {
        header: 'کیوآرکد',
        id: 'qr',
        enableSorting: false,
        cell: ({ row }: { row: any }) => (
          <IconButton tone="primary" label="نمایش QR" onClick={() => setQrTable(row.original as Table)}>
            <FaQrcode />
          </IconButton>
        ),
      },
      {
        header: 'عملیات',
        id: 'actions',
        enableSorting: false,
        cell: ({ row }: { row: any }) => {
          const table = row.original as Table;
          return (
            <div className="flex items-center justify-center gap-1.5">
              <IconButton tone="success" label="باز کردن منو" onClick={() => window.open(table.menuUrl, '_blank')}>
                <FaExternalLinkAlt />
              </IconButton>
              <IconButton tone="info" label="ویرایش میز" onClick={() => handleEditClick(table)}>
                <FaEdit />
              </IconButton>
              <IconButton tone="danger" label="حذف میز" onClick={() => setDeleteTarget(table)}>
                <FaTrash />
              </IconButton>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable<Table>({
    data: pagedTables,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableColumnFilters: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.numeral || !form.capacity) return;
    const submissionData = {
      numeral: Number(form.numeral),
      capacity: Number(form.capacity),
      status: form.status,
    };

    if (editingTable) {
      updateTable({ id: editingTable._id, data: submissionData });
    } else {
      createTable(submissionData);
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <div className="p-4">
      <PageHeader
        title="میزها"
        subtitle={`${toPersianNumber(filteredTables.length)} میز · ${toPersianNumber(
          allTables.filter((t) => t.status === 'available').length
        )} آزاد`}
        icon={<FaTable />}
        actions={
          <>
            <Segmented
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: '', label: 'همه' },
                ...Object.entries(tableStatus).map(([key, label]) => ({ value: key, label })),
              ]}
            />
            <Button icon={<FaPlus />} onClick={handleAddClick}>
              افزودن
            </Button>
          </>
        }
      />

      {isLoading ? (
        <LoadingState rows={5} label="در حال دریافت میزها…" />
      ) : isError ? (
        <ErrorState message={error?.message} onRetry={() => void refetch()} />
      ) : filteredTables.length === 0 ? (
        <EmptyState
          title="میزی پیدا نشد"
          hint="وضعیت فیلتر یا شماره جستجو را تغییر دهید، یا میز تازه اضافه کنید."
          action={
            <Button icon={<FaPlus />} onClick={handleAddClick}>
              افزودن میز
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
          <TablePager total={filteredTables.length} page={page} pageSize={PAGE_SIZE} onPageChange={setPage} />
        </div>
      )}

      {isModalOpen && (
        <Modal
          title={editingTable ? 'ویرایش میز' : 'افزودن میز جدید'}
          onClose={closeModal}
          footer={
            <>
              <Button tone="neutral" variant="outline" onClick={closeModal}>
                انصراف
              </Button>
              <Button type="submit" form="table-form" disabled={isSubmitting}>
                {isSubmitting
                  ? (editingTable ? 'در حال ویرایش...' : 'در حال افزودن...')
                  : (editingTable ? 'ویرایش' : 'افزودن')}
              </Button>
            </>
          }
        >
          <form id="table-form" onSubmit={handleSubmit} className="space-y-4">
            <TextInput
              label="شماره میز"
              name="numeral"
              type="number"
              min="1"
              value={form.numeral}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, numeral: e.target.value }))}
              required
              dir="ltr"
            />
            <TextInput
              label="ظرفیت"
              name="capacity"
              type="number"
              min="1"
              value={form.capacity}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, capacity: e.target.value }))}
              required
              dir="ltr"
            />
            <SelectInput
              label="وضعیت"
              name="status"
              value={form.status}
              onChange={(e: ChangeEvent<HTMLSelectElement>) => setForm(f => ({ ...f, status: e.target.value }))}
            >
              {Object.entries(tableStatus).map(([key, value]) => (
                <option key={key} value={key.toLowerCase()}>{value}</option>
              ))}
            </SelectInput>
          </form>
        </Modal>
      )}

      {qrTable && (
        <Modal
          title={`QR میز ${toPersianNumber(qrTable.numeral)}`}
          onClose={() => setQrTable(null)}
          width="md"
          footer={
            <>
              <Button tone="neutral" variant="outline" onClick={() => setQrTable(null)}>
                بستن
              </Button>
              <Button tone="primary" icon={<FaPrint />} onClick={handlePrint}>
                چاپ کارت
              </Button>
            </>
          }
        >
          {/* کارت چاپی همیشه روشن می‌ماند تا روی کاغذ درست بیفتد */}
          <div
            ref={printableRef}
            className="printable-content mx-auto flex aspect-[3/4] w-full max-w-[340px] flex-col justify-between rounded-2xl border-2 border-dashed border-primary-200 bg-white p-4 text-center text-black"
          >
            <div className="mb-2">
              <h1 className="text-base font-bold text-gray-900 mb-1">
                به {user.restaurantName} خوش آمدید
              </h1>
              <p className="text-[11px] text-gray-600">
                برای مشاهده منو، دوربین گوشی خود را روی بارکد زیر بگیرید
              </p>
            </div>

            <div className="mb-2 rounded-xl bg-primary-50 p-2">
              <p className="text-base font-bold text-primary-800">
                میز: {toPersianNumber(qrTable.numeral || 0)}
              </p>
              <p className="text-[11px] text-primary-700">
                ظرفیت: {toPersianNumber(qrTable.capacity || 0)} نفر
              </p>
            </div>

            <div className="flex flex-1 items-center justify-center">
              <div className="rounded-xl border border-gray-200 bg-white p-2">
                <QRCodeSVG value={qrTable.menuUrl || ''} size={160} includeMargin level="H" />
              </div>
            </div>

            <div className="mb-2 rounded-xl bg-gray-50 p-2">
              <h3 className="mb-1 text-xs font-bold text-gray-700">نحوه استفاده</h3>
              <ul className="list-none space-y-0.5 text-right text-[11px] text-gray-600">
                <li>۱. دوربین گوشی را باز کنید</li>
                <li>۲. روی گزینه اسکن QR کد بزنید</li>
                <li>۳. دوربین را روی بارکد بگیرید</li>
                <li>۴. منوی دیجیتال باز می‌شود</li>
              </ul>
            </div>

            <div className="border-t border-primary-100 pt-2 text-center">
              <p className="text-[10px] text-gray-500 mb-0.5">Powered by</p>
              <p className="text-sm font-bold text-primary-600 font-vazirmatn-title">Zoodmiz</p>
            </div>
          </div>
        </Modal>
      )}

      {deleteTarget && (
        <Modal
          title="تایید حذف میز"
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
          <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
            میز
            <span className="mx-1 font-bold text-gray-900 dark:text-white">
              {toPersianNumber(deleteTarget.numeral)}
            </span>
            با ظرفیت
            <span className="mx-1 font-bold text-gray-900 dark:text-white">
              {toPersianNumber(deleteTarget.capacity)} نفر
            </span>
            حذف شود؟ این عمل قابل بازگشت نیست.
          </p>
        </Modal>
      )}
    </div>
  );
};

export default Tables;
