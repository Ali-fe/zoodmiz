import { Link } from "react-router-dom";

interface NavbarProps {
  onFeaturesClick?: () => void;
  onPricingClick?: () => void;
  onContactClick?: () => void;
}

const Navbar = ({ onFeaturesClick, onPricingClick, onContactClick }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100/50">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo and Brand */}
          <div className="flex items-center gap-1 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <img src="/photos/zoodmiz.svg" alt="لوگوی زودمیز" className="w-10 h-10 relative" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">زودمیز</span>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-blue-600 transition-all duration-200 relative group">
              خانه
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <button
              onClick={onFeaturesClick}
              className="text-gray-600 hover:text-blue-600 transition-all duration-200 relative group"
            >
              ویژگی‌ها
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={onPricingClick}
              className="text-gray-600 hover:text-blue-600 transition-all duration-200 relative group"
            >
              تعرفه‌ها
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </button>
            <button
              onClick={onContactClick}
              className="text-gray-600 hover:text-blue-600 transition-all duration-200 relative group"
            >
              تماس با ما
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            
          <Link
              to="/restaurants"
              className="px-5 py-2.5 text-blue-600 hover:text-orange-500 transition-all duration-200 relative group"
            >
              رستوران ها
            </Link>
            {/* <Link
              to="/dashboard/register"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
            >
              ثبت نام
            </Link> */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
