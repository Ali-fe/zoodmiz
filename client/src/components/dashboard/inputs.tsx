import { useDashboardContext } from '../../pages/dashboard/dashboard';
export const TextInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  ...props
}: any) => {
  const { isDarkTheme } = useDashboardContext();
  return (
    <div>
      <label className={`block text-xs font-medium mb-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${isDarkTheme
          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
        } focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 ${className}`}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

// --- کامپوننت سلکت ---
export const SelectInput = ({
  label,
  name,
  value,
  onChange,
  children,
  className = '',
  ...props
}: any) => {
  const { isDarkTheme } = useDashboardContext();
  return (
    <div>
      <label className={`block text-xs font-medium mb-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-2.5 py-1 text-sm rounded-md border ${isDarkTheme
          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
        } focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

// --- کامپوننت تکست اریا ---
export const TextAreaInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  className = '',
  ...props
}: any) => {
  const { isDarkTheme } = useDashboardContext();
  return (
    <div>
      <label className={`block text-xs font-medium mb-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${isDarkTheme
          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
        } focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 resize-none ${className}`}
        rows={rows}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};
