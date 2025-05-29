import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { showToast } from '../utils/toast';

const AuthRedirect = () => {
  const navigate = useNavigate();
  const hasChecked = useRef(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (hasChecked.current) return;
      
      try {
        // چک کردن وضعیت احراز هویت کاربر
        const { data } = await customFetch.get('/users/current-user');
        if (data) {
          hasChecked.current = true;
          navigate('/dashboard');
          showToast.info('شما قبلاً وارد شده‌اید'); 
        }
      } catch (error) {
        hasChecked.current = true;
        // اگر کاربر لاگین نکرده باشد، در همین صفحه می‌ماند
      }
    };

    checkAuth();
  }, [navigate]);

  return null; // این کامپوننت چیزی رندر نمی‌کند
};

export default AuthRedirect; 