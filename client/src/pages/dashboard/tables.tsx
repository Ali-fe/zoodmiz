import { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { FaSpinner, FaPlus, FaTimes, FaQrcode, FaTrash } from 'react-icons/fa';
import { useDashboardContext } from './dashboard';
import { useTables, useCreateTable ,useDeleteTable} from '../../hooks/useTables';
import { Table } from '../../types/table';
import {QRCodeSVG} from 'qrcode.react';

const Tables = () => {
  const { isDarkTheme } = useDashboardContext();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ numeral: '1', capacity: '2' });

  const [qrModal, setQrModal] = useState<{ open: Boolean; table: Table | null }>({
    open: false,
    table: null
  });

  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; table: Table | null }>({
    isOpen: false,
    table: null
  });
  const { data: allTables = [], isLoading, isError, error } = useTables();
  const { mutate: createTable, isPending: isCreating } = useCreateTable(() => {
    setModalOpen(false);
    setForm({ numeral: '1', capacity: '2' });
  });
  
  const { mutate: deleteTable } = useDeleteTable(() => {
    setDeleteModal({ isOpen: false, table: null });
  });

  const handleDelete = () => {
    if (!deleteModal.table) return;
    deleteTable(deleteModal.table._id);
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
              {status === 'available' ? 'آزاد' : status === 'reserved' ? 'اشغال' : 'رزرو'}
            </span>
          );
        },
      },
      {
        header: 'کیوآرکد',
        id: 'qr',
        cell: ({ row }) => (
          <button
            onClick={() => setQrModal({ open: true, table: row.original })}
            className="p-1.5 rounded-md hover:bg-gray-100"
            title="نمایش QR"
          >
            <FaQrcode className="text-lg text-blue-500" />
          </button>
        ),
      },
      {
        header: 'عملیات',
        id: 'delete',
        cell: ({ row }: { row: any }) => {
          const table = row.original;
          return (<button
            onClick={() => setDeleteModal({ isOpen: true, table })}
            className="p-1.5 rounded-md hover:bg-red-100"
            title="حذف میز"
          >
            <FaTrash className="text-sm text-red-500" />
          </button>
        )},
      },
    ],
    []
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
      ...form,
      numeral: Number(form.numeral),
      capacity: Number(form.capacity),
    };

    createTable(submissionData);
  };

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
          onClick={() => setModalOpen(true)}
          className={`px-3 py-1.5 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-sm
            ${isDarkTheme
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
        >
          <FaPlus className="inline mr-1" /> افزودن
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
      {/* Modal for adding new table */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-lg p-4 max-w-sm w-full transition-all duration-300 overflow-hidden ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>افزودن میز جدید</h2>
              <button
                onClick={() => setModalOpen(false)}
                className={`p-2 rounded-md transition-colors duration-200 ${isDarkTheme ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">شماره میز</label>
                <input
                  name='numeral'
                  type="number"
                  min="1"
                  className="border rounded px-1 py-1 w-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={form.numeral}
                  onChange={e => setForm(f => ({ ...f, numeral: e.target.value }))}
                  required
                  dir='ltr'
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">ظرفیت</label>
                <input
                  name='capacity'
                  type="number"
                  min="1"
                  className="border rounded px-1 py-1 w-full focus:outline-none focus:ring-2 focus:ring-amber-400"
                  value={form.capacity}
                  onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))}
                  required
                  dir='ltr'
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium ${isDarkTheme ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-all duration-200`}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className={`px-3 py-1 text-sm rounded-md font-medium ${isDarkTheme ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'} transition-all duration-200 disabled:opacity-60`}
                >
                  {isCreating ? 'در حال افزودن...' : 'افزودن'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {qrModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-lg p-6 shadow-lg flex flex-col items-center">
            <div className='mb-5 text-center'>
              <h1>به رستوران باران خوش آمدید.</h1>
              <span>برای مشاهده منو اسکن کنید.</span>
              <br/>
            <span className='mt-2'>میز شماره {qrModal.table?.numeral.toString()}</span>
            
           
            </div>
            
            <QRCodeSVG value={qrModal.table?.menuUrl} size={200} />
            <div className='mt-5'>
            <button onClick={() => setQrModal({ open: false, table: null })} className="text-sm p-1 bg-blue-500 text-white rounded">بستن</button>
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