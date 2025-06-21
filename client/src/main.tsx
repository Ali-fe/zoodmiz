import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

// استایل‌های سفارشی برای toast
import './styles/toast.css';

createRoot(document.getElementById('root')!).render(
  <>
    <App />
    <ToastContainer
      rtl
      position="top-center"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      className="font-vazirmatn"
    />
  </>,
)
