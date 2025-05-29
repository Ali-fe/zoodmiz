import { Form, Link, redirect, useNavigation } from "react-router-dom";
import FormRow from "../components/formrow";
import customFetch from "../utils/customFetch";
import { toast } from 'react-toastify';

export const action = async ({ request }: { request: Request }) => {
  const formdata = await request.formData();
  const data = Object.fromEntries(formdata);
  try {
    await customFetch.post('/auth/register', data);
    toast.success('ثبت‌نام شما با موفقیت انجام شد');
    return redirect('/login');
  }
  catch (err: any) {
    toast.error(err?.response?.data?.msg);
    return err;
  }
}

export default function Register() {
  const navigation = useNavigation();
  const isSubmiting = navigation.state === 'submitting';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-[500px] transform transition-all duration-300 hover:shadow-2xl">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 font-vazirmatn">ثبت نام در سامانه</h2>
          <p className="text-gray-600 font-vazirmatn text-sm">لطفا اطلاعات خود را با دقت وارد کنید</p>
        </div>

        <Form method="post" className="flex flex-col space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FormRow type="text" labelText="نام" name="name" defaultValue="" />
            <FormRow type="text" labelText="نام خانوادگی" name="lastName" defaultValue="" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <FormRow type="tel" labelText="شماره همراه" name="phone" defaultValue="" />
            <FormRow type="email" labelText="ایمیل" name="email" defaultValue="" />
          </div>

          <FormRow type="text" labelText="نام رستوران" name="restaurantName" defaultValue="" />
          <FormRow type="text" labelText="آدرس" name="address" defaultValue="" />
          <FormRow 
            type="password" 
            labelText="رمز عبور" 
            name="password" 
            defaultValue="" 
          />

          <button 
            type="submit" 
            disabled={isSubmiting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-4 rounded-xl font-vazirmatn font-semibold hover:from-blue-700 hover:to-indigo-700 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-md disabled:opacity-70 disabled:cursor-not-allowed mt-4"
          >
            {isSubmiting ? "در حال ثبت نام ..." : "ثبت نام"}
          </button>
        </Form>

        <p className="text-center text-gray-600 mt-8 font-vazirmatn">
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