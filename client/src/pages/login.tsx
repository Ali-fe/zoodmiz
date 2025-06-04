import { Form, Link, useNavigation, redirect, useActionData } from "react-router-dom";
import FormRow from "../components/formrow";
import customFetch from "../utils/customFetch";
import { showToast } from '../utils/toast';

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post('/auth/login', data);
    showToast.success('شما با موفقیت وارد شدید');
    return redirect('/dashboard');
  }
  catch (err: any) {
    showToast.error(err?.response?.data?.msg);
    return err;
  }
}

export default function Login() {
  const navigation = useNavigation();
  const isSubmiting = navigation.state === 'submitting';
  const errors = useActionData();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100">
      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-[400px] transform transition-all duration-300 hover:shadow-3xl border border-white/20">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ورود به حساب</h2>
          <p className="text-gray-600 text-sm">خوش آمدید! لطفا اطلاعات خود را وارد کنید</p>
        </div>
        
        <Form method="post" className="flex flex-col space-y-4">
          <FormRow type="email" labelText="ایمیل" name="email" isLeftAligned placeholder ="Email"/>
          <FormRow type="password" labelText="رمز عبور" name="password" isLeftAligned placeholder ="Password"/>
          
          {errors?.msg && (
            <div className="bg-red-50/80 backdrop-blur-sm border-r-4 border-red-500 p-2.5 rounded-xl text-right">
              <p className="text-red-600 text-sm">نام کاربری یا کلمه عبور اشتباه است</p>
            </div>
          )}
          
          <button 
            type="submit" 
            disabled={isSubmiting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-70 text-sm disabled:cursor-not-allowed"
          >
            {isSubmiting ? 'در حال ورود ...' : 'ورود به حساب'}
          </button>
        </Form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-gray-500 bg-white/80 backdrop-blur-sm">یا</span>
          </div>
        </div>
        
        <Form method="post" className="flex flex-col space-y-4">
          <input className="hidden" name="email" type="email" value="ali90fereidouni@gmail.com" />
          <input className="hidden" name="password" type="password" value="1111111111" />
          <button 
            type="submit"
            disabled={isSubmiting}
            className="bg-gradient-to-r from-indigo-500/90 to-blue-500/90 text-white py-2.5 px-4 rounded-xl font-semibold hover:from-indigo-600 hover:to-blue-600 transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg disabled:opacity-70 text-sm disabled:cursor-not-allowed"
          >
            {isSubmiting ? 'در حال ورود' : 'ورود آزمایشی'}
          </button>
        </Form>

        <p className="text-center text-gray-600 mt-6 text-sm">
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
  );
}