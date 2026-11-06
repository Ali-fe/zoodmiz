import { useEffect, type ButtonHTMLAttributes, type CSSProperties, type ReactNode } from 'react';
import { FaExclamationTriangle, FaInbox, FaSpinner, FaTimes } from 'react-icons/fa';

export type Tone = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

const badgeTones: Record<Tone, string> = {
  neutral: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200',
  primary: 'bg-primary-100 text-primary-800 dark:bg-primary-500/20 dark:text-primary-200',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300',
  danger: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  info: 'bg-sky-100 text-sky-800 dark:bg-sky-500/20 dark:text-sky-300',
};

const iconTones: Record<Tone, string> = {
  neutral: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  primary: 'bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300',
  success: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300',
  warning: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  danger: 'bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300',
  info: 'bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-300',
};

/* یک جدول واحد برای رنگ وضعیت سفارش، میز و رزرو */
const statusTones: Record<string, Tone> = {
  pending: 'warning',
  preparing: 'info',
  ready: 'success',
  delivered: 'neutral',
  confirmed: 'info',
  completed: 'success',
  available: 'success',
  occupied: 'danger',
  reserved: 'warning',
  cancelled: 'danger',
};

export const statusTone = (status: string): Tone => statusTones[status] ?? 'neutral';

const buttonTones: Record<Tone, string> = {
  neutral: 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
  primary: 'bg-primary text-white hover:bg-primary-600 shadow-card',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  warning: 'bg-amber-500 text-white hover:bg-amber-600',
  danger: 'bg-rose-600 text-white hover:bg-rose-700',
  info: 'bg-sky-600 text-white hover:bg-sky-700',
};

export const Panel = ({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) => (
  <div
    style={style}
    className={`rounded-2xl border border-gray-100 bg-white shadow-card dark:border-gray-700 dark:bg-gray-800 ${className}`}
  >
    {children}
  </div>
);

interface PageHeaderProps {
  title: string;
  subtitle?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
}

export const PageHeader = ({ title, subtitle, icon, actions }: PageHeaderProps) => (
  <div className="mb-5 flex flex-wrap items-center gap-3">
    {icon && (
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-card [&>svg]:h-4 [&>svg]:w-4">
        {icon}
      </span>
    )}
    <div className="min-w-0">
      <h1 className="text-lg font-bold leading-tight text-gray-900 dark:text-white font-vazirmatn-title">
        {title}
      </h1>
      {subtitle && <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </div>
    {actions && <div className="ms-auto flex flex-wrap items-center gap-2">{actions}</div>}
  </div>
);

export const Badge = ({ tone = 'neutral', children }: { tone?: Tone; children: ReactNode }) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold whitespace-nowrap ${badgeTones[tone]}`}
  >
    {children}
  </span>
);

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: Tone;
  variant?: 'solid' | 'outline' | 'ghost';
  icon?: ReactNode;
}

export const Button = ({
  tone = 'primary',
  variant = 'solid',
  icon,
  className = '',
  children,
  ...rest
}: ButtonProps) => {
  const shape = 'inline-flex items-center justify-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-bold transition-all duration-200 active:scale-[.97] disabled:cursor-not-allowed disabled:opacity-60 [&>svg]:h-3.5 [&>svg]:w-3.5';
  const look =
    variant === 'solid'
      ? buttonTones[tone]
      : variant === 'outline'
        ? `bg-transparent border ${badgeTones[tone]} hover:brightness-95`
        : `bg-transparent ${badgeTones[tone]} hover:brightness-95`;
  return (
    <button className={`${shape} ${look} ${className}`} {...rest}>
      {icon}
      {children}
    </button>
  );
};

export const IconButton = ({
  tone = 'info',
  label,
  onClick,
  disabled,
  children,
}: {
  tone?: Tone;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    className={`grid h-8 w-8 place-items-center rounded-lg transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 [&>svg]:h-3.5 [&>svg]:w-3.5 ${iconTones[tone]} hover:shadow-card`}
  >
    {children}
  </button>
);

const modalWidths = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-2xl' };

interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: keyof typeof modalWidths;
}

export const Modal = ({ title, onClose, children, footer, width = 'sm' }: ModalProps) => {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 animate-fade-in bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className={`relative w-full ${modalWidths[width]} animate-scale-in overflow-hidden rounded-2xl bg-white shadow-lift dark:bg-gray-800`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-700">
          <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100 font-vazirmatn-title">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="بستن"
            className="grid h-8 w-8 place-items-center rounded-full text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/15"
          >
            <FaTimes className="h-3.5 w-3.5" />
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto px-4 py-4">{children}</div>
        {footer && (
          <div className="flex flex-wrap justify-end gap-2 border-t border-gray-100 px-4 py-3 dark:border-gray-700">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

export const TableWrap = ({ children }: { children: ReactNode }) => (
  <Panel className="overflow-hidden">
    <div className="overflow-x-auto">{children}</div>
  </Panel>
);

export const Th = ({
  children,
  className = '',
  sorted = false,
  onSort,
}: {
  children?: ReactNode;
  className?: string;
  sorted?: 'asc' | 'desc' | false;
  onSort?: (event: unknown) => void;
}) => (
  <th
    className={`border-b border-gray-100 bg-gray-50/80 px-3 py-3 text-center text-xs font-bold text-gray-600 whitespace-nowrap dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-300 ${className}`}
  >
    {onSort ? (
      <button
        type="button"
        onClick={onSort}
        className="inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 transition-colors hover:bg-primary-100/70 hover:text-primary-700 dark:hover:bg-primary-500/15"
      >
        {children}
        <span
          className={`text-[9px] transition-all duration-200 ${
            sorted === 'asc' ? 'rotate-0 opacity-100' : sorted === 'desc' ? 'rotate-180 opacity-100' : 'opacity-25'
          }`}
        >
          ▲
        </span>
      </button>
    ) : (
      children
    )}
  </th>
);

export const Td = ({ children, className = '' }: { children?: ReactNode; className?: string }) => (
  <td className={`border-b border-gray-50 px-3 py-2.5 text-center text-sm dark:border-gray-700/60 ${className}`}>
    {children}
  </td>
);

export const Tr = ({ children }: { children: ReactNode }) => (
  <tr className="transition-colors odd:bg-gray-50/50 hover:bg-primary-50/50 dark:odd:bg-gray-900/20 dark:hover:bg-primary-500/5">
    {children}
  </tr>
);

interface SegmentedOption {
  value: string;
  label: ReactNode;
}

export const Segmented = ({
  options,
  value,
  onChange,
}: {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="inline-flex flex-wrap gap-1 rounded-xl bg-gray-100 p-1 dark:bg-gray-900/50">
    {options.map((option) => (
      <button
        key={option.value || 'all'}
        type="button"
        onClick={() => onChange(option.value)}
        className={`rounded-lg px-3 py-1.5 text-xs font-bold whitespace-nowrap transition-all duration-200 ${
          value === option.value
            ? 'bg-white text-primary-700 shadow-card dark:bg-gray-700 dark:text-primary-200'
            : 'text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export const LoadingState = ({
  rows = 4,
  label = 'در حال بارگذاری…',
}: {
  rows?: number;
  label?: string;
}) => (
  <div className="space-y-2.5 py-2" role="status">
    <div className="flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-300">
      <FaSpinner className="h-3.5 w-3.5 animate-spin" />
      {label}
    </div>
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="skeleton h-12 rounded-xl bg-gray-100 dark:bg-gray-700" />
    ))}
  </div>
);

export const EmptyState = ({
  icon,
  title,
  hint,
  action,
}: {
  icon?: ReactNode;
  title: string;
  hint?: string;
  action?: ReactNode;
}) => (
  <div className="flex animate-fade-up flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-white/70 px-4 py-14 text-center dark:border-gray-700 dark:bg-gray-800/40">
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-50 text-primary-500 dark:bg-primary-500/15 dark:text-primary-300 [&>svg]:h-5 [&>svg]:w-5">
      {icon || <FaInbox />}
    </span>
    <p className="text-sm font-bold text-gray-700 dark:text-gray-200">{title}</p>
    {hint && <p className="max-w-xs text-xs leading-relaxed text-gray-500 dark:text-gray-400">{hint}</p>}
    {action}
  </div>
);

export const ErrorState = ({ message, onRetry }: { message?: string; onRetry?: () => void }) => (
  <div className="flex animate-fade-up flex-col items-center justify-center gap-3 rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-12 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 [&>svg]:h-5 [&>svg]:w-5">
      <FaExclamationTriangle />
    </span>
    <p className="text-sm font-bold text-rose-700 dark:text-rose-200">خطا در بارگذاری اطلاعات</p>
    {message && <p className="max-w-xs text-xs text-rose-600/90 dark:text-rose-200/80">{message}</p>}
    {onRetry && (
      <Button tone="danger" variant="outline" onClick={onRetry}>
        تلاش دوباره
      </Button>
    )}
  </div>
);
