const fieldSkin = (hasError: boolean) =>
  `w-full rounded-xl border bg-gray-50 px-3 py-2 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:bg-white focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500 dark:bg-gray-900/50 dark:text-gray-100 dark:focus:bg-gray-900 dark:disabled:bg-gray-800 dark:disabled:text-gray-400 ${
    hasError
      ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-200 dark:border-rose-500/40 dark:focus:ring-rose-500/30'
      : 'border-gray-200 focus:border-primary-400 focus:ring-primary-200 dark:border-gray-600 dark:focus:ring-primary-500/30'
  }`;

const Label = ({ label }: { label?: string }) =>
  label ? (
    <label className="mb-1.5 block text-xs font-bold text-gray-600 dark:text-gray-300">{label}</label>
  ) : null;

const Hint = ({ error }: { error?: string }) =>
  error ? <p className="mt-1 text-[11px] font-bold text-rose-600 dark:text-rose-300">{error}</p> : null;

export const TextInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  error = '',
  ...props
}: any) => {
  return (
    <div className={className}>
      <Label label={label} />
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={fieldSkin(!!error)}
        placeholder={placeholder}
        {...props}
      />
      <Hint error={error} />
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
  return (
    <div className={className}>
      <Label label={label} />
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`${fieldSkin(false)} appearance-none bg-left bg-no-repeat pe-3`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23b44a07'%3E%3Cpath fill-rule='evenodd' d='M5.3 7.5a1 1 0 0 1 1.4 0L10 11l3.3-3.5a1 1 0 1 1 1.4 1.4l-4 4.2a1 1 0 0 1-1.4 0l-4-4.2a1 1 0 0 1 0-1.4Z'/%3E%3C/svg%3E\")",
          backgroundPosition: 'left 0.6rem center',
          backgroundSize: '1rem',
        }}
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
  error = '',
  ...props
}: any) => {
  return (
    <div className={className}>
      <Label label={label} />
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className={`${fieldSkin(!!error)} resize-y leading-relaxed`}
        rows={rows}
        placeholder={placeholder}
        {...props}
      />
      <Hint error={error} />
    </div>
  );
};
