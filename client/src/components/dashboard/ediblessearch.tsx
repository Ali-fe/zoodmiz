import { useState } from 'react';

const EdiblesSearch = ({ onSearch }: { onSearch: (value: string) => void }) => {
  const [value, setValue] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="flex justify-center">
      <input
        type="text"
        className="text-sm border rounded px-3 py-1 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-amber-400"
        placeholder="جستجو در لیست خوراکی‌ها..."
        value={value}
        onChange={handleChange}
        dir="rtl"
      />
    </div>
  );
};

export default EdiblesSearch; 