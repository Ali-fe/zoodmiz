import { Form, Link, redirect, useNavigation } from "react-router-dom";
import FormRow from '../../components/formrow';
import AuthShell from '../../components/dashboard/authshell';
import customFetch from "../../utils/customFetch";
import { showToast } from '../../utils/toast';
import { FaSpinner, FaUserPlus } from "react-icons/fa";

export const action = async ({ request }: { request: Request }) => {
  const formdata = await request.formData();
  const data = Object.fromEntries(formdata);
  try {
    await customFetch.post('/auth/register', data);
    showToast.success('ثبت‌نام شما با موفقیت انجام شد');
    return redirect('/dashboard/login');
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
    <AuthShell
      title="ثبت‌نام رستوران در زودمیز"
      subtitle="یک حساب برای مدیریت منو، میزها و سفارش‌ها بسازید."
      footer={
        <>
          حساب کاربری دارید؟{' '}
          <Link to="/dashboard/login" className="font-bold text-primary-700 hover:text-primary-800 dark:text-primary-300">
            وارد شوید
          </Link>
        </>
      }
    >
      <Form method="post" className="space-y-1">
        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
          <FormRow type="text" labelText="نام" name="name" placeholder="نام مدیر رستوران" />
          <FormRow type="text" labelText="نام خانوادگی" name="lastName" placeholder="نام خانوادگی" />
        </div>

        <div className="grid grid-cols-1 gap-x-3 sm:grid-cols-2">
          <FormRow type="tel" labelText="شماره همراه" name="phone" placeholder="09xxxxxxxxx" isLeftAligned />
          <FormRow type="email" labelText="ایمیل" name="email" placeholder="you@restaurant.ir" isLeftAligned />
        </div>

        <FormRow type="text" labelText="نام رستوران" name="restaurantName" placeholder="نام یا برند رستوران" />
        <FormRow type="text" labelText="آدرس" name="address" placeholder="آدرس کامل رستوران" />
        <FormRow type="password" labelText="رمز عبور" name="password" placeholder="رمز عبور ۸ رقمی دلخواه" />

        <button
          type="submit"
          disabled={isSubmiting}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-primary-500 to-primary-600 py-3 text-sm font-bold text-white shadow-card transition-all duration-200 hover:from-primary-600 hover:to-primary-700 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmiting ? <FaSpinner className="h-3.5 w-3.5 animate-spin" /> : <FaUserPlus className="h-3.5 w-3.5" />}
          {isSubmiting ? 'در حال ثبت‌نام…' : 'ثبت‌نام'}
        </button>
      </Form>
    </AuthShell>
  );
}
