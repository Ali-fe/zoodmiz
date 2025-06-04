import { FaHome, FaInfoCircle, FaPhone, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white shadow-md p-3 fixed top-0 w-full z-50" dir="rtl">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/photos/zoodmiz.svg" alt="زودمیز" className="w-8 h-8" />
          <h1 className="text-xl font-bold text-primary font-vazirmatn">زودمیز</h1>
        </div>

        <nav className="hidden md:block">
          <ul className="flex gap-4 text-base font-vazirmatn">
            <li>
              <a 
                href="#features" 
                className="flex items-center gap-1.5 text-gray-700 hover:text-primary transition-colors duration-200"
              >
                <FaHome className="text-lg" />
                <span>ویژگی‌ها</span>
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className="flex items-center gap-1.5 text-gray-700 hover:text-primary transition-colors duration-200"
              >
                <FaInfoCircle className="text-lg" />
                <span>درباره ما</span>
              </a>
            </li>
            <li>
              <a 
                href="#contact" 
                className="flex items-center gap-1.5 text-gray-700 hover:text-primary transition-colors duration-200"
              >
                <FaPhone className="text-lg" />
                <span>تماس با ما</span>
              </a>
            </li>
          </ul>
        </nav>

        <div>
          <Link 
            to="/login" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors duration-200 font-vazirmatn text-sm"
          >
            <FaUserCircle className="text-lg" />
            <span>ورود</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
