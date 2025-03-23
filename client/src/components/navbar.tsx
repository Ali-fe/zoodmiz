import { FaHome, FaInfoCircle, FaPhone } from "react-icons/fa";
export default function Navbar() {
  {/* Header */ }
  return (
    <header className="bg-white shadow-md p-5 flex justify-between items-center px-10 rounded-b-lg fixed top-0 w-full z-50">
      <div className="flex">
      <img src="./photos/zoodmiz.svg" className="w-10 h-10" />
        <h1 className="text-3xl font-extrabold text-blue-600">زودمیز</h1> 
      </div>
      <nav>
        <ul className="flex space-x-6 text-lg">
          <li className="flex items-center space-x-2 hover:text-blue-500">
            <FaHome className="text-xl" />
            <a href="#features">ویژگی‌ها</a>
          </li>
          <li className="flex items-center space-x-2 hover:text-blue-500">
            <FaInfoCircle className="text-xl" />
            <a href="#about">درباره ما</a>
          </li>
          <li className="flex items-center space-x-2 hover:text-blue-500">
            <FaPhone className="text-xl" />
            <a href="#contact">تماس با ما</a>
          </li>
        </ul>
      </nav>
    </header>
  )
}
