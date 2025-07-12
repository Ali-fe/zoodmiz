import { Form, Link, redirect, useNavigation } from "react-router-dom";
import FormRow from '../components/formrow';
import customFetch from "../utils/customFetch";
import { showToast } from '../utils/toast';
import { FaArrowRight } from "react-icons/fa";

export const action = async ({ request }: { request: Request }) => {
  const formdata = await request.formData();
  const data = Object.fromEntries(formdata);
  try {
    await customFetch.post('/auth/register', data);
    showToast.success('ثبت‌نام شما با موفقیت انجام شد');
    return redirect('/login');
  }
  catch (err: any) {
    showToast.error(err?.response?.data?.msg);
    return err;
  }
}

export default function Register() {
  const navigation = useNavigation();
  const isSubmiting = navigation.state === 'submitting';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="absolute top-6 left-6">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-all duration-200 group"
        >
          <FaArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
          <span>بازگشت به صفحه اصلی</span>
        </Link>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-xl w-[450px] transform transition-all duration-300 hover:shadow-2xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">ثبت نام در زودمیز</h2>
          <p className="text-gray-600 text-sm">لطفا اطلاعات خود را با دقت وارد کنید</p>
        </div>

        <Form method="post" className="flex flex-col space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FormRow type="text" labelText="نام" name="name" placeholder ="نام مدیر رستوران" />
            <FormRow type="text" labelText="نام خانوادگی" name="lastName" placeholder ="نام خانوادگی" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <FormRow type="tel" labelText="شماره همراه" name="phone" placeholder ="Phone" isLeftAligned />
            <FormRow type="email" labelText="ایمیل" name="email" placeholder ="Email" isLeftAligned/>
          </div>

          <FormRow type="text" labelText="نام رستوران" name="restaurantName" placeholder ="نام و یا برند رستوران" />
          <FormRow type="text" labelText="آدرس" name="address" placeholder ="آدرس کامل رستوران خود را وارد کنید" />
          <FormRow 
            type="password" 
            labelText="رمز عبور" 
            name="password" 
            placeholder ="رمز عبور 8 رقمی دلخواه" 
          />

          <button 
            type="submit" 
            disabled={isSubmiting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-3 text-sm"
          >
            {isSubmiting ? "در حال ثبت نام ..." : "ثبت نام"}
          </button>
        </Form>

        <p className="text-center text-gray-600 mt-6 text-sm">
          حساب کاربری دارید؟{' '}
          <Link 
            to="/login" 
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
          >
            وارد شوید
          </Link>
        </p>
      </div>
    </div>
  );
}