import { Form, Link, useNavigation, redirect, useActionData } from "react-router-dom";
import FormRow from "../components/formrow";
import { toast } from 'react-toastify';
import customFetch from "../utils/customFetch";
import AuthLoader from "../components/AuthLoader";

export const action = async ({ request }: { request: Request }) => {
  const formdata = await request.formData();
  const data = Object.fromEntries(formdata);
  try {
    await customFetch.post('/auth/login', data);
    toast.success('شما با موفقیت وارد شدید');
    return redirect('/dashboard');
  }
  catch (error: any) {
    error.msg = error?.response?.data?.msg;
    error.code = error?.response?.status;
    return error;
  }
}

export default function Login() {
  const navigation = useNavigation();
  const isSubmiting = navigation.state === 'submitting';
  const errors = useActionData();

  return (
    <AuthLoader>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white p-10 rounded-2xl shadow-xl w-[450px] transform transition-all duration-300 hover:shadow-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2 font-vazirmatn">ورود به حساب</h2>
            <p className="text-gray-600 font-vazirmatn text-sm">خوش آمدید! لطفا اطلاعات خود را وارد کنید</p>
          </div>
          
          <Form method="post" className="flex flex-col space-y-5">
            <FormRow type="email" labelText="ایمیل" name="email" defaultValue="ایمیل" />
            <FormRow type="password" labelText="رمز عبور" name="password" defaultValue="رمز عبور" />
            
            {errors?.msg && (
              <div className="bg-red-50 border-r-4 border-red-500 p-3 rounded-md text-right">
                <p className="text-red-600 text-sm font-vazirmatn">نام کاربری یا کلمه عبور اشتباه است</p>
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isSubmiting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl font-vazirmatn font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-70"
            >
              {isSubmiting ? 'در حال ورود ...' : 'ورود به حساب'}
            </button>
          </Form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-500 bg-white font-vazirmatn">یا</span>
            </div>
          </div>
          
          <Form method="post" className="flex flex-col space-y-4">
            <input className="hidden" name="email" type="email" value="ali90fereidouni@gmail.com" />
            <input className="hidden" name="password" type="password" value="1111111111" />
            <button 
              type="submit"
              disabled={isSubmiting}
              className="bg-gradient-to-r from-indigo-500/90 to-blue-500/90 text-white py-3.5 px-4 rounded-xl font-vazirmatn font-semibold hover:from-indigo-600 hover:to-blue-600 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-70"
            >
              {isSubmiting ? 'در حال ورود' : 'ورود آزمایشی'}
            </button>
          </Form>

          <p className="text-center text-gray-600 mt-8 font-vazirmatn">
            حساب کاربری ندارید؟{' '}
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              ثبت‌نام
            </Link>
          </p>
        </div>
      </div>
    </AuthLoader>
  );
}