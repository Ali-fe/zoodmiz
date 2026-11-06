import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import customFetch from '../utils/customFetch';
import { showToast } from '../utils/toast';

const AuthRedirect = () => {
  const navigate = useNavigate();
  const hasChecked = useRef(false);
  const location = useLocation(); 
  const isPublicPage = !location.pathname.startsWith('/dashboard');

  useEffect(() => {
    const checkAuth = async () => {
      if(!isPublicPage)
          return;   
      if(hasChecked.current) return;
      try {
        hasChecked.current = true;
        const { data } = await customFetch.get('/users/current-user');
        
        if (data) {
          showToast.info('شما قبلاً وارد شده‌اید'); 
          navigate('/dashboard');
        }
      } catch (error) {
        hasChecked.current = true;
      }
    };

    checkAuth();
  }, [navigate]);
  return null;
};

export default AuthRedirect; 