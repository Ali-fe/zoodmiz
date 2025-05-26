
import { GrSidebar } from "react-icons/gr";

type NavbarProps = {
  onOpenSidebar: () => void;
};

const Navbar = ({ onOpenSidebar }: NavbarProps) => {
  return (
    <header className="w-full bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      <h1 className="text-lg font-bold">پنل مدیریت رستوران</h1>
      <button onClick={onOpenSidebar}>
        <GrSidebar className="h-6 w-6 text-white" />
      </button>
    </header>
  );
};

export default Navbar;
