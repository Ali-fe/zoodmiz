import { RefObject } from 'react';
import { Link } from 'react-router-dom';
import { FaUserCircle, FaChevronDown, FaSpinner, FaSignOutAlt, FaTable } from 'react-icons/fa';
import type { useLogoutCustomer } from '../../hooks/useCustomer';

interface UserButtonProps {
  userLoading: boolean;
  customer: { name: string } | null;
  uiState: { showUserMenu: boolean };
  updateUiState: (updates: { showUserMenu?: boolean; showPhoneModal?: boolean }) => void;
  logoutCustomer: ReturnType<typeof useLogoutCustomer>;
  refetchUser: () => void;
  userMenuRef: RefObject<HTMLDivElement | null>;
}

const UserButton = ({
  userLoading,
  customer,
  uiState,
  updateUiState,
  logoutCustomer,
  refetchUser,
  userMenuRef,
}: UserButtonProps) => {
  if (userLoading) {
    return (
      <div className="flex shrink-0 items-center gap-1.5 rounded-xl bg-gray-100 px-3 py-1.5 text-xs text-gray-400 dark:bg-gray-700 dark:text-gray-300">
        <FaSpinner className="h-3.5 w-3.5 animate-spin" />
        <span>در حال بررسی ورود...</span>
      </div>
    );
  }
  return customer ? (
    <div className="relative shrink-0" ref={userMenuRef}>
      <button
        onClick={() => updateUiState({ showUserMenu: !uiState.showUserMenu })}
        aria-expanded={uiState.showUserMenu}
        className="flex items-center gap-1.5 rounded-xl py-1.5 pe-2 ps-1.5 text-sm font-bold text-gray-700 transition-colors hover:bg-primary-50 dark:text-gray-200 dark:hover:bg-primary-500/15"
      >
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-card [&>svg]:h-4 [&>svg]:w-4">
          <FaUserCircle />
        </span>
        <span className="hidden max-w-[10ch] truncate sm:inline">{customer.name}</span>
        <FaChevronDown
          className={`h-2.5 w-2.5 text-gray-400 transition-transform duration-200 ${uiState.showUserMenu ? 'rotate-180' : ''}`}
        />
      </button>
      {uiState.showUserMenu && (
        <div
          className="absolute top-full end-0 z-50 mt-1 w-44 animate-scale-in overflow-hidden rounded-2xl border border-gray-100 bg-white p-1 shadow-lift dark:border-gray-700 dark:bg-gray-800"
        >
          <Link
            to="/restaurants/reservations"
            onClick={() => updateUiState({ showUserMenu: false })}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-primary-50 hover:text-primary-700 dark:text-gray-200 dark:hover:bg-primary-500/15"
          >
            <FaTable className="text-xs" />
            رزروهای من
          </Link>
          <button
            onClick={() => {
              logoutCustomer.mutate(undefined, { onSuccess: () => refetchUser() });
              updateUiState({ showUserMenu: false });
            }}
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-rose-600 transition-colors hover:bg-rose-50 disabled:opacity-60 dark:text-rose-300 dark:hover:bg-rose-500/15"
            disabled={logoutCustomer.isPending}
          >
            {logoutCustomer.isPending ? <FaSpinner className="animate-spin text-xs" /> : <FaSignOutAlt className="text-xs" />}
            خروج
          </button>
        </div>
      )}
    </div>
  ) : (
    <button
      onClick={() => updateUiState({ showPhoneModal: true })}
      className="flex shrink-0 items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm font-bold text-white shadow-card transition-all duration-200 hover:bg-primary-600 active:scale-[.97]"
    >
      <FaUserCircle className="h-4 w-4" />
      ورود
    </button>
  )
};

export default UserButton; 