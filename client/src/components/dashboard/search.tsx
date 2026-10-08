import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useDashboardContext } from '../../pages/dashboard/dashboard';
import { FaSearch } from 'react-icons/fa';

const Search = ({ onSearch }: { onSearch: (value: string) => void }) => {
  const { isDarkTheme } = useDashboardContext();
  const [value, setValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const location = useLocation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };
  useEffect(() => {
    if (location.pathname.includes('edibles')) {
      setPlaceholder('جستجو در خوراکی ها ...');

    } else if (location.pathname.includes('orders')) {
      setPlaceholder('جستجو در سفارشات ...');
    }
    else if (location.pathname.includes('menu')) {
      setPlaceholder('جستجو در منو ...');
    }
    else if (location.pathname.includes('tables')) {
      setPlaceholder('جستجو در میزها ...');
    }
    else{
      setPlaceholder('جستجو ...');
    }
    setValue('');
  }, [location])
  return (
      <div className="relative w-1/4 d:w-2/3 mx-auto">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          className={`w-full px-4 py-2 text-sm text-center rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 ${isDarkTheme ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}
        />
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      </div>
  );
};

export default Search; 