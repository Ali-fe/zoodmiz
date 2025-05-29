import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { showToast } from '../utils/toast';

const AuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // چک کردن وضعیت احراز هویت کاربر
        const { data } = await customFetch.get('/users/current-user');
        if (data) {
          showToast.info('شما قبلاً وارد شده‌اید');
          navigate('/dashboard');
        }
      } catch (error) {
        // اگر کاربر لاگین نکرده باشد، در همین صفحه می‌ماند
      }
    };

    checkAuth();
  }, [navigate]);

  return null; // این کامپوننت چیزی رندر نمی‌کند
};

export default AuthRedirect; 