import { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from '@tanstack/react-table';
import { FaSpinner, FaEdit, FaTrash, FaTimes, FaPlus, FaMinus } from 'react-icons/fa';
import { useDashboardContext } from './dashboard';
import { useNavigate } from 'react-router-dom';
import { edibleType } from '../../data/data';
import { toPersianNumber } from '../../utils/persianNumbers';
import Edible from '../../types/edible';
import { useEdibles , useToggleMenu , useDeleteEdible} from '../../hooks/useEdibles';

const Edibles = () => {
  const { isDarkTheme , searchQuery } = useDashboardContext();
  const navigate = useNavigate();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; edible: Edible | null }>({
    isOpen: false,
    edible: null
  });
  const [typeFilter, setTypeFilter] = useState<string>('');

  const { data: allEdibles = [], isLoading, isError, error } = useEdibles();
  const { mutate: toggleMenu, isPending: isMenuing } = useToggleMenu();
  const { mutate: deleteEdible } = useDeleteEdible(() => {
    setDeleteModal({ isOpen: false, edible: null });
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

  const handleDelete = () => {
    if (!deleteModal.edible) return;
    deleteEdible(deleteModal.edible._id);
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
          cell: (info: any) => info.getValue(),
        },
        {
          header: 'تصویر',
          accessorKey: 'imageURL',
          cell: ({ getValue, row }: { getValue: () => any, row: any }) =>
            getValue() ? (
              <div className="w-10 h-10 rounded-sm overflow-hidden mx-auto">
                <img src={getValue()} alt={row.original.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>بدون تصویر</span>
            ),
        },
        {
          header: 'نام',
          accessorKey: 'name',
        },
        {
          header: 'توضیحات',
          accessorKey: 'description',
        },
        {
          header: 'قیمت (تومان)',
          accessorKey: 'price',
          cell: ({ getValue }: { getValue: () => any }) => toPersianNumber(Number(getValue()).toLocaleString()),
        },
        {
          header: 'تخفیف (درصد)',
          accessorKey: 'discount',
          cell: ({ getValue }: { getValue: () => any }) => toPersianNumber(Number(getValue()).toLocaleString()),
        },
        {
          header: () => 'عملیات',
          id: 'actions',
          cell: ({ row }: { row: any }) => {
            const edible = row.original;
            const isInMenu = edible.menu;
            return (
              <div className="flex items-center justify-center gap-2">
                <button
                  title="ویرایش"
                  onClick={() => navigate(`/dashboard/edible/${edible._id}`)}
                  className={`p-1.5 rounded-md transition-colors duration-200 ${isDarkTheme
                    ? 'text-blue-400 hover:bg-blue-500/20'
                    : 'text-blue-600 hover:bg-blue-100'
                    }`}
                >
                  <FaEdit className="text-sm" />
                </button>
                <button
                  title="حذف"
                  onClick={() => setDeleteModal({ isOpen: true, edible })}
                  className={`p-1.5 rounded-md transition-colors duration-200 ${isDarkTheme
                    ? 'text-red-400 hover:bg-red-500/20'
                    : 'text-red-600 hover:bg-red-100'
                    }`}
                >
                  <FaTrash className="text-sm" />
                </button>
                <button
                  title={isInMenu ? 'حذف از منو' : 'افزودن به منو'}
                  onClick={() => handleToggleMenu(edible)}
                  className={`p-1.5 rounded-md transition-colors duration-200 ${
                    isInMenu
                      ? isDarkTheme
                        ? 'text-yellow-400 hover:bg-yellow-500/20'
                        : 'text-yellow-600 hover:bg-yellow-100'
                      : isDarkTheme
                        ? 'text-green-400 hover:bg-green-500/20'
                        : 'text-green-600 hover:bg-green-100'
                  }`}
                >
                  {isMenuing?<FaSpinner className='text-sm fa-spin'/>: (isInMenu ? <FaMinus className="text-sm" /> : <FaPlus className="text-sm" />)}
                </button>
              </div>
            );
          },
        },
      ],
      [isDarkTheme, navigate]
    );

  const table = useReactTable<Edible>({
    data: filteredEdibles,
    columns,
    getCoreRowModel: getCoreRowModel(),
    enableColumnFilters: true,
  });

  return (
    <div className={`p-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex flex-row  md:items-center md:justify-between gap-3 mb-6">
        <div className="flex items-center gap-10">
          <h1 className={`text-l font-bold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
            خوراکی ها
          </h1>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className={`px-2 py-1 rounded-md border text-sm ${isDarkTheme
              ? 'bg-gray-800 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-900'
              }`}
          >
            <option value="">همه</option>
            {edibleType.map(type => { return <option key={type} value={type}>{type}</option> })}
          </select>
        </div>
        <button
          onClick={() => navigate('/dashboard/edible')}
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
                      className={`py-2 px-3 border-b text-center font-semibold text-sm ${isDarkTheme ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'
                        }`}
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
                onClick={() => setDeleteModal({ isOpen: false, edible: null })}
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
                onClick={() => setDeleteModal({ isOpen: false, edible: null })}
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

export default Edibles;