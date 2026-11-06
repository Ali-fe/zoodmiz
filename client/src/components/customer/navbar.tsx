import { Link, useLocation } from "react-router-dom";
import { FaSearch, FaTimes } from "react-icons/fa";
import UserButton from "./userbutton";
import { useCustomerContext } from '../../pages/customer/customerlayout';

interface CustomerNavbarProps {
  userMenuRef: React.RefObject<HTMLDivElement | null>;
}

const CustomerNavbar = ({ userMenuRef }: CustomerNavbarProps) => {
  const { restaurant, uiState, updateUiState, userLoading, customer, logoutCustomer, refetchUser } = useCustomerContext();
  const location = useLocation();
  let searchPlaceholder = "جستجو";
  if (location.pathname === "/restaurants") {
    searchPlaceholder = "جستجوی رستوران‌";
  } else if (location.pathname.startsWith("/restaurants/menu")) {
    searchPlaceholder = `جستجو در منو ${restaurant?.name || ''}`;
  }

  return (
    <nav className="sticky top-0 z-30 h-14 border-b border-gray-100 bg-white/90 backdrop-blur md:h-12 dark:border-gray-700/70 dark:bg-gray-800/90">
      <div className="mx-auto flex h-full items-center justify-between gap-x-3 px-3 md:px-4">
        <Link to="/" className="flex shrink-0 items-center gap-2 transition-opacity hover:opacity-80">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 shadow-card">
            <img src="/photos/zoodmiz.svg" alt="" className="h-5 w-5" />
          </span>
          <span className="hidden font-vazirmatn-title text-lg font-bold text-gray-800 sm:inline dark:text-white">
            زودمیز
          </span>
        </Link>

        <div className="relative w-full max-w-xs">
          <FaSearch className="pointer-events-none absolute start-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            aria-label={searchPlaceholder}
            placeholder={searchPlaceholder}
            value={uiState.searchQuery}
            onChange={(event) => updateUiState({ searchQuery: event.target.value })}
            className="h-9 w-full rounded-xl border border-gray-200 bg-gray-50 pe-9 ps-9 text-center text-xs text-gray-800 transition-all duration-200 placeholder:text-gray-400 focus:border-primary-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-200 dark:border-gray-600 dark:bg-gray-900/50 dark:text-gray-100 dark:focus:bg-gray-900 dark:focus:ring-primary-500/30"
          />
          {uiState.searchQuery ? (
            <button
              type="button"
              onClick={() => updateUiState({ searchQuery: '' })}
              aria-label="پاک کردن جستجو"
              className="absolute end-2 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-gray-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
            >
              <FaTimes className="h-2.5 w-2.5" />
            </button>
          ) : null}
        </div>

        <UserButton
          userLoading={userLoading}
          customer={customer}
          uiState={uiState}
          updateUiState={updateUiState}
          logoutCustomer={logoutCustomer}
          refetchUser={refetchUser}
          userMenuRef={userMenuRef}
        />
      </div>
    </nav>
  );
};

export default CustomerNavbar;
