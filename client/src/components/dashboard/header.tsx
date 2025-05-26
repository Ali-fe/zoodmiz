"use client"

import { FiMenu, FiBell, FiSearch } from "react-icons/fi"

interface HeaderProps {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center bg-white dark:bg-gray-800 shadow-sm dark:border-b dark:border-gray-700">
      <div className="flex items-center px-4 w-full" >
        <button className="p-1 rounded-md text-gray-500 hover:bg-gray-100 mr-2" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FiMenu className="h-5 w-5" />
          <span className="sr-only">باز کردن نوار منو</span>
        </button>

        <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-start">
          <div className="max-w-lg w-full">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="جستجو ..."
                className="pl-10 pr-3 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center">
          <button className="p-1 rounded-md text-gray-500 hover:bg-gray-100 relative">
            <FiBell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
            <span className="sr-only">اعلانات</span>
          </button>
        </div>
      </div>
    </header>
  )
}
