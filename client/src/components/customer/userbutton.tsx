import { RefObject } from 'react';
import { FaUserCircle, FaChevronDown, FaSpinner, FaSignOutAlt } from 'react-icons/fa';

interface UserButtonProps {
  userLoading: boolean;
  customer: { name: string } | null;
  uiState: { showUserMenu: boolean };
  updateUiState: (updates: Partial<any>) => void;
  logoutCustomer: { mutate: (v?: any, opts?: any) => void; isPending: boolean };
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
  if (userLoading) return null;
  return customer ? (
    <div className="relative" >
      <button
        onClick={() => updateUiState({ showUserMenu: !uiState.showUserMenu })}
        className="flex items-center gap-1 text-sm font-bold text-gray-700 hover:text-amber-500 transition-colors"
      >
        <FaUserCircle className="text-amber-500 text-lg md:text-xl" />
        {customer.name}
        <FaChevronDown className={`text-xs transition-transform ${uiState.showUserMenu ? 'rotate-180' : ''}`} />
      </button>
      {uiState.showUserMenu && (
        <div ref={userMenuRef} className="absolute top-full right-0 mt-1 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <button
            onClick={() => {
              logoutCustomer.mutate(undefined, { onSuccess: () => refetchUser() });
              updateUiState({ showUserMenu: false });
            }}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors disabled:opacity-60"
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
      className="flex items-center gap-1 px-3 py-1.5 rounded bg-amber-500 text-white text-sm hover:bg-amber-600 transition"
    >
      <FaUserCircle className="text-lg md:text-xl" />
      ورود
    </button>
  );
};

export default UserButton; 