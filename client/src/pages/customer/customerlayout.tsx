import { useRef, useState, createContext, useContext, useEffect } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";
import Footer from '../../components/footer';
import CustomerNavbar from '../../components/customer/navbar';
import { useCustomer, useLogoutCustomer, useMenu, useRequestOtp, useVerifyOtp } from '../../hooks/useCustomer';
import PhoneModal from '../../components/customer/PhoneModal';
import OtpModal from '../../components/customer/OtpModal';

// Customer Context
export const CustomerContext = createContext<any>(null);
export const useCustomerContext = () => useContext(CustomerContext);

const CustomerLayout = () => {
  const location = useLocation();
  const params = useParams();
  const menuResult = useMenu(params.restaurantId!); // همیشه فراخوانی شود
  let restaurant = undefined;
  if (location.pathname.startsWith('/restaurants/menu')) {
    restaurant = menuResult.restaurant;
  }
  const userMenuRef = useRef<HTMLDivElement>(null);
  const [uiState, setUiState] = useState({
    activeCategory: "",
    searchQuery: "",
    notesInput: "",
    showPhoneModal: false,
    showCartModal: false,
    showOtpModal: false,
    showUserMenu: false
  });
  const updateUiState = (updates: Partial<typeof uiState>) => {
    setUiState(prev => ({ ...prev, ...updates }));
  };
  const [otpState, setOtpState] = useState({
    phone: '',
    isNew: null as boolean | null,
    name: '',
    lastName: '',
    code: '',
    error: ''
  });
  const [userState, setUserState] = useState({
    phone: null as string | null
  });
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();
  const updateOtpState = (updates: Partial<typeof otpState>) => {
    setOtpState(prev => ({ ...prev, ...updates }));
  };
  const updateUserState = (updates: Partial<typeof userState>) => {
    setUserState(prev => ({ ...prev, ...updates }));
  };
  const { user: customer, isLoading: userLoading, refetch: refetchUser } = useCustomer();
  const logoutCustomer = useLogoutCustomer();
  const contextValue = {
    customer,
    userLoading,
    logoutCustomer,
    refetchUser,
    uiState,
    updateUiState,
    restaurant,
    otpState,
    setOtpState,
    userState,
    setUserState,
    requestOtp,
    verifyOtp,
    updateOtpState,
    updateUserState
  };

  // state جدید برای تایمر OTP
  const [otpTimer, setOtpTimer] = useState({ secondsLeft: 120, expired: false });
  const timerRef = useRef<number | null>(null);

  // مدیریت تایمر OTP
  useEffect(() => {
    if (!uiState.showOtpModal) return;
    if (otpTimer.secondsLeft <= 0) {
      setOtpTimer({ secondsLeft: 0, expired: true });
      return;
    }
    timerRef.current = window.setTimeout(() => setOtpTimer((prev) => ({ ...prev, secondsLeft: prev.secondsLeft - 1 })), 1000);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [otpTimer.secondsLeft, uiState.showOtpModal]);

  // وقتی مدال OTP باز می‌شود و قبلا تایمر منقضی نشده، تایمر را ریست نکن
  useEffect(() => {
    if (uiState.showOtpModal && otpTimer.secondsLeft === 0) {
      setOtpTimer({ secondsLeft: 120, expired: false });
    }
  }, [uiState.showOtpModal]);

  // بستن منوی کاربر با کلیک بیرون یا کلید Escape
  useEffect(() => {
    if (!uiState.showUserMenu) return;
    const handleMouseDown = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUiState(prev => ({ ...prev, showUserMenu: false }));
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setUiState(prev => ({ ...prev, showUserMenu: false }));
    };
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [uiState.showUserMenu]);

  return (
    <CustomerContext.Provider value={contextValue}>
      <div className="min-h-screen bg-cream font-vazirmatn text-gray-900 transition-colors duration-200 dark:bg-gray-900 dark:text-white" dir="rtl">
        <CustomerNavbar userMenuRef={userMenuRef as React.RefObject<HTMLDivElement>} />
        <Outlet />
        <PhoneModal
          open={uiState.showPhoneModal}
          onClose={() => updateUiState({ showPhoneModal: false })}
          onSubmit={(phone: string) => {
            updateOtpState({ error: '' });
            requestOtp.mutate(phone, {
              onSuccess: (data) => {
                updateOtpState({
                  phone,
                  isNew: data.isNew,
                  name: '',
                  lastName: '',
                  code: ''
                });
                updateUiState({
                  showPhoneModal: false,
                  showOtpModal: true
                });
              },
              onError: (err: any) => {
                updateOtpState({ error: err?.response?.data?.msg || 'خطا در ارسال کد' });
              }
            });
          }}
          error={
            otpState.error ||
            (typeof requestOtp.error === 'string'
              ? requestOtp.error
              : requestOtp.error?.response?.data?.msg ||
                requestOtp.error?.message ||
                undefined)
          }
          loading={requestOtp.isPending}
        />
        <OtpModal
          open={uiState.showOtpModal}
          isNew={!!otpState.isNew}
          name={otpState.name}
          lastName={otpState.lastName}
          code={otpState.code}
          onChange={fields => {
            if (fields.name !== undefined) updateOtpState({ name: fields.name });
            if (fields.lastName !== undefined) updateOtpState({ lastName: fields.lastName });
            if (fields.code !== undefined) updateOtpState({ code: fields.code });
          }}
          onClose={() => updateUiState({ showOtpModal: false })}
          onSubmit={() => {
            updateOtpState({ error: '' });
            verifyOtp.mutate(
              otpState.isNew
                ? { phone: otpState.phone, code: otpState.code, name: otpState.name, lastName: otpState.lastName }
                : { phone: otpState.phone, code: otpState.code },
              {
                onSuccess: () => {
                  updateUserState({ phone: otpState.phone });
                  updateUiState({ showOtpModal: false });
                  refetchUser();
                  updateOtpState({
                    phone: '',
                    isNew: null,
                    name: '',
                    lastName: '',
                    code: ''
                  });
                },
                onError: (err: any) => {
                  updateOtpState({ error: err?.response?.data?.msg || 'کد اشتباه است' });
                }
              }
            );
          }}
          error={
            otpState.error ||
            (typeof verifyOtp.error === 'string'
              ? verifyOtp.error
              : verifyOtp.error?.response?.data?.msg ||
                verifyOtp.error?.message ||
                undefined)
          }
          loading={verifyOtp.isPending}
          onResend={() => {
            if (otpState.phone) {
              updateOtpState({ error: '' });
              setOtpTimer({ secondsLeft: 120, expired: false }); // ریست تایمر فقط اینجا
              requestOtp.mutate(otpState.phone, {
                onSuccess: (data) => {
                  updateOtpState({
                    isNew: data.isNew,
                    name: '',
                    lastName: '',
                    code: ''
                  });
                },
                onError: (err: any) => {
                  updateOtpState({ error: err?.response?.data?.msg || 'خطا در ارسال کد' });
                }
              });
            }
          }}
          secondsLeft={otpTimer.secondsLeft}
          expired={otpTimer.expired}
        />
        <Footer />
      </div>
    </CustomerContext.Provider>
  );
};

export default CustomerLayout;
