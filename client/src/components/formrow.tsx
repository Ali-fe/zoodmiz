
interface FormRowProps {
  type: string;
  name: string;
  labelText: string;
  placeholder?: string;
  isLeftAligned?: boolean;
}

const FormRow = ({ type, name, labelText, placeholder = '', isLeftAligned = false }: FormRowProps) => {
  return (
    <div dir={isLeftAligned ? 'ltr' : 'rtl'} className="mb-4 text-right">
      <label htmlFor={name} className="mb-1.5 block text-xs font-bold text-gray-600 dark:text-gray-300">
        {labelText}
      </label>
      <input
        type={type}
        name={name}
        id={name}
        dir={isLeftAligned ? 'ltr' : undefined}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-900/50 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-primary-500/30 ${
          isLeftAligned ? 'text-left' : 'text-right'
        }`}
      />
    </div>
  );
};

export default FormRow;
