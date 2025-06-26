import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// استایل‌های سفارشی برای toast
import './styles/toast.css';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
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
    {/* <ReactQueryDevtools initialIsOpen={false} /> */}
  </QueryClientProvider>,
)
