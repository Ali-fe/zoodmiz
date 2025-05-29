import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { showToast } from '../utils/toast';

interface AuthLoaderProps {
  redirectTo?: string;
  showToast?: boolean;
  children: React.ReactNode;
}

const AuthLoader: React.FC<AuthLoaderProps> = ({
  redirectTo = '/dashboard',
  showToast: shouldShowToast = true,
  children
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await customFetch.get('/users/current-user');
        if (data) {
          if (shouldShowToast) {
            showToast.info('شما قبلاً وارد شده‌اید');
          }
          navigate(redirectTo);
        }
      } catch (error) {
        // اگر کاربر لاگین نکرده باشد، محتوای اصلی نمایش داده می‌شود
      }
    };

    checkAuth();
  }, [navigate, redirectTo, shouldShowToast]);

  return <>{children}</>;
};

export default AuthLoader; 