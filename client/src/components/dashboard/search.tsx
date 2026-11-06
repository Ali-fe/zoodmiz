import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';

const placeholders: Array<[string, string]> = [
  ['edibles', 'جستجو در خوراکی‌ها…'],
  ['orders', 'جستجو در سفارشات…'],
  ['menu', 'جستجو در منو…'],
  ['tables', 'جستجو در میزها…'],
  ['reservations', 'جستجو در رزروها…'],
  ['images', 'جستجو در تصاویر…'],
];

const Search = ({ onSearch }: { onSearch: (value: string) => void }) => {
  const [value, setValue] = useState('');
  const [placeholder, setPlaceholder] = useState('جستجو…');
  const location = useLocation();

  useEffect(() => {
    const match = placeholders.find(([route]) => location.pathname.includes(route));
    setPlaceholder(match ? match[1] : 'جستجو…');
    setValue('');
  }, [location]);

  return (
    <div className="relative w-full max-w-xs flex-shrink">
      <FaSearch className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onSearch(e.target.value);
        }}
        className="h-9 w-full rounded-xl border border-transparent bg-gray-100 pe-3 ps-8 text-xs text-gray-800 transition-all duration-200 placeholder:text-gray-400 focus:border-primary-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 dark:bg-gray-900/50 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-primary-500/30"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            setValue('');
            onSearch('');
          }}
          aria-label="پاک کردن جستجو"
          className="absolute left-2 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
        >
          <FaTimes className="h-2.5 w-2.5" />
        </button>
      )}
    </div>
  );
};

export default Search;
