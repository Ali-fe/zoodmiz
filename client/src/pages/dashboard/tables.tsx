import { useState, useMemo, useEffect, useRef } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { FaSpinner, FaPlus, FaTimes, FaQrcode, FaTrash, FaEdit, FaPrint, FaExternalLinkAlt } from 'react-icons/fa';
import { useDashboardContext } from './dashboard';
import { useTables, useCreateTable, useDeleteTable, useUpdateTable } from '../../hooks/useTables';
import { Table } from '../../types/table';
import { QRCodeSVG } from 'qrcode.react';
import { tableStatus } from '../../data/data';
import { SelectInput, TextInput } from '../../components/dashboard/inputs';
import { useReactToPrint } from 'react-to-print';

const Tables = () => { 
    const { isDarkTheme, user } = useDashboardContext();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);

  const [form, setForm] = useState({ numeral: '', capacity: '', status: 'available' });

  const [qrModal, setQrModal] = useState<{ open: boolean; table: Table | null }>({
    open: false,
    table: null,
  });

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; table: Table | null }>({
    isOpen: false,
    table: null,
  });

  const printableRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: printableRef,
    documentTitle: `QR-میز-${qrModal.table?.numeral}`,
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

  const { data: allTables = [], isLoading, isError, error } = useTables();

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTable(null);
    setForm({ numeral: '', capacity: '', status: 'available' });
  };

  const { mutate: createTable, isPending: isCreating } = useCreateTable(closeModal);
  const { mutate: updateTable, isPending: isUpdating } = useUpdateTable(closeModal);
  const { mutate: deleteTable } = useDeleteTable(() => setDeleteModal({ isOpen: false, table: null }));

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
    if (!deleteModal.table) return;
    deleteTable(deleteModal.table._id);
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
    if (search) result = result.filter(t => t.numeral.toString().includes(search));
    return result;
  }, [allTables, search]);

  const columns = useMemo<ColumnDef<Table, any>[]>(
    () => [
      {
        header: 'شماره',
        accessorKey: 'numeral',
      },
      {
        header: 'ظرفیت',
        accessorKey: 'capacity',
      },
      {
        header: 'وضعیت',
        accessorKey: 'status',
        cell: ({ getValue }) => {
          const status = getValue();
          return (
            <span className={
              status === 'available'
                ? 'text-green-500 font-bold'
                : status === 'occupied'
                  ? 'text-red-500 font-bold'
                  : 'text-yellow-500 font-bold'
            }>
              {tableStatus[status as keyof typeof tableStatus]}
            </span>
          );
        },
      },
      {
        header: 'کیوآرکد',
        id: 'qr',
        cell: ({ row }:{row : any}) => {
          const table = row.original;
          return (
          <button
            onClick={() => setQrModal({ open: true, table: table })}
            className="p-1.5 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            title="نمایش QR"
          >
            <FaQrcode className="text-lg text-blue-500" />
          </button>
        )},
      },
      {
        header: 'عملیات',
        id: 'actions',
        cell: ({ row }: { row: any }) => {
          const table = row.original;
          return (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => window.open(table.menuUrl, '_blank')}
                className={`p-1.5 rounded-md transition-colors duration-200 ${isDarkTheme ? 'text-green-400 hover:bg-green-500/20' : 'text-green-600 hover:bg-green-100'}`}
                title="باز کردن منو"
              >
                <FaExternalLinkAlt className="text-sm" />
              </button>
              <button
                onClick={() => handleEditClick(table)}
                className={`p-1.5 rounded-md transition-colors duration-200 ${isDarkTheme ? 'text-blue-400 hover:bg-blue-500/20' : 'text-blue-600 hover:bg-blue-100'}`}
                title="ویرایش میز"
              >
                <FaEdit className="text-sm" />
              </button>
              <button
                onClick={() => setDeleteModal({ isOpen: true, table })}
                className={`p-1.5 rounded-md transition-colors duration-200 ${isDarkTheme ? 'text-red-400 hover:bg-red-500/20' : 'text-red-600 hover:bg-red-100'}`}
                title="حذف میز"
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

  const table = useReactTable<Table>({
    data: filteredTables,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
    <div className={`p-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex flex-row md:items-center md:justify-between gap-3 mb-6">
        <div className="flex items-center gap-10">
          <h1 className={`text-l font-bold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
            میزها
           </h1>
          <input
            type="text"
            className="text-sm border rounded px-3 py-1 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
            placeholder="جستجو بر اساس شماره میز..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            dir="rtl"
          />
        </div>
        <button
          onClick={handleAddClick}
          className={`px-3 py-1.5 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-sm
            ${isDarkTheme
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
        >
          <FaPlus className="inline ml-1" />افزودن
        </button>
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
      {/* Modal for adding/editing table */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-lg p-4 max-w-sm w-full transition-all duration-300 overflow-hidden ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>{editingTable ? 'ویرایش میز' : 'افزودن میز جدید'}</h2>
              <button
                onClick={closeModal}
                className={`p-2 rounded-md transition-colors duration-200 ${isDarkTheme ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <TextInput
                label="شماره میز"
                name="numeral"
                type="number"
                min="1"
                value={form.numeral}
                onChange={(e: any) => setForm(f => ({ ...f, numeral: e.target.value }))}
                required
                dir="ltr"
              />
              <TextInput
                label="ظرفیت"
                name="capacity"
                type="number"
                min="1"
                value={form.capacity}
                onChange={(e: any) => setForm(f => ({ ...f, capacity: e.target.value }))}
                required
                dir="ltr"
              />

              <SelectInput
                label="وضعیت"
                name="status"
                value={form.status}
                onChange={(e: any) => setForm(f => ({ ...f, status: e.target.value }))}
              >
                {Object.entries(tableStatus).map(([key, value]) => (
                  <option key={key} value={key.toLowerCase()}>{value}</option>
                ))}
              </SelectInput>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium ${isDarkTheme ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-all duration-200`}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-3 py-1 text-sm rounded-md font-medium ${isDarkTheme ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} transition-all duration-200 disabled:opacity-60`}
                >
                  {isSubmitting ? (editingTable ? 'در حال ویرایش...' : 'در حال افزودن...') : (editingTable ? 'ویرایش' : 'افزودن')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {qrModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-black rounded-lg p-4 shadow-lg flex flex-col items-center w-full max-w-sm max-h-[90vh] overflow-y-auto">
            <div ref={printableRef} className="printable-content text-center p-4 border-2 border-dashed border-gray-400 rounded-lg bg-white w-full aspect-[3/4] flex flex-col justify-between">
              {/* Header */}
              <div className="mb-2">
                
                <h1 className="text-lg font-bold text-gray-900 mb-1">به {user.restaurantName} خوش آمدید</h1>
                <p className="text-xs text-gray-600">برای مشاهده منو، دوربین گوشی خود را روی بارکد زیر بگیرید</p>
              </div>

              {/* Table Info */}
              <div className="bg-gray-50 rounded-lg p-2 mb-2">
                <p className="text-base font-semibold text-gray-800">میز: {qrModal.table?.numeral.toString()}</p>
                <p className="text-xs text-gray-600">ظرفیت: {qrModal.table?.capacity.toString()} نفر</p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center mb-2 flex-1 flex items-center">
                <div className="p-2 bg-white border border-gray-200 rounded-lg">
                  <QRCodeSVG 
                    value={qrModal.table?.menuUrl || ''} 
                    size={160} 
                    includeMargin={true}
                    level="H"
                  />
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-lg p-2 mb-2">
                <h3 className="font-semibold text-blue-800 mb-1 text-sm text-center">نحوه استفاده:</h3>
                <ul className="text-xs text-blue-700 text-right space-y-0.5 list-none">
                  <li>• دوربین گوشی خود را باز کنید</li>
                  <li>• روی گزینه اسکن QR کد کلیک کنید</li>
                  <li>• دوربین را روی بارکد بالا بگیرید</li>
                  <li>• منوی دیجیتال باز خواهد شد</li>
                </ul>
              </div>

              {/* Footer */}
              <div className="text-center border-t pt-2">
                <p className="text-xs text-gray-500 mb-1">Powered by</p>
                <p className="text-sm font-bold text-amber-500">Zoodmiz</p>
                
              </div>
            </div>

            <div className="mt-4 text-center flex gap-x-2 no-print">
              <button onClick={() => setQrModal({ open: false, table: null })} className="text-sm px-3 py-1.5 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors">
                بستن
              </button>
              <button onClick={handlePrint} className="flex items-center gap-x-1 text-sm px-3 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                <FaPrint />
                چاپ
              </button>
            </div>
          </div>
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
                onClick={() => setDeleteModal({ isOpen: false, table: null })}
                className={`p-2 rounded-md transition-colors duration-200 ${isDarkTheme
                  ? 'text-gray-400 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <FaTimes />
              </button>
            </div>
            <p className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
              آیا از حذف این مورد اطمینان دارید؟ این عمل قابل بازگشت نیست.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setDeleteModal({ isOpen: false, table: null })}
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

export default Tables;