import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import UserButton from "./userbutton";

interface PublicMenuNavbarProps {
  restaurant: any;
  uiState: any;
  updateUiState: (updates: Partial<any>) => void;
  userLoading: boolean;
  customer: { name: string } | null;
  logoutCustomer: any;
  refetchUser: () => void;
  userMenuRef: React.RefObject<HTMLDivElement>;
}

const PublicMenuNavbar = ({
  restaurant,
  uiState,
  updateUiState,
  userLoading,
  customer,
  logoutCustomer,
  refetchUser,
  userMenuRef
}: PublicMenuNavbarProps) => {
  return (
    <nav className="sticky top-0 z-30 bg-white shadow-sm h-14 md:h-12">
      <div className="max-w-auto mx-auto flex items-center justify-between h-full px-2 md:px-4 gap-x-4 md:gap-x-8">
        {/* Right Side: Logo */}
        <Link to="/" className="flex items-center gap-x-2">
          <img
            src="/photos/zoodmiz.svg"
            alt="Zoodmiz Logo"
            className="w-8 h-8"
          />
          <span className="text-base md:text-xl font-bold font-vazirmatn-title text-gray-800">
            زودمیز
          </span>
        </Link>
        {/* Center: Search */}
        <div className="relative w-8/12 max-w-xs md:w-1/3">
          <input
            type="text"
            placeholder={`جستجو در منوی ${restaurant?.name || ''}`}
            value={uiState.searchQuery}
            onChange={(e) => updateUiState({ searchQuery: e.target.value })}
            className="w-full h-8 p-1 text-sm text-center bg-gray-100 border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        {/* Left Side: Login/Register or User */}
        <div className="flex items-center gap-2">
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
      </div>
    </nav>
  );
};

export default PublicMenuNavbar; 