import { Form, Link, useNavigation, redirect, useActionData } from "react-router-dom";
import FormRow from '../../components/formrow';
import AuthShell from '../../components/dashboard/authshell';
import customFetch from "../../utils/customFetch";
import { showToast } from '../../utils/toast';
import { FaSignInAlt, FaSpinner } from "react-icons/fa";
import axios from 'axios';

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const data = Object.fromEntries(formData);

  try {
    await customFetch.post('/auth/login', data);
    showToast.success('شما با موفقیت وارد شدید');
    return redirect('/dashboard');
  }
  catch (err: unknown) {
    const message = axios.isAxiosError<{ msg?: string }>(err)
      ? err.response?.data?.msg
      : undefined;
    showToast.error(message || 'ورود ناموفق بود، لطفاً دوباره تلاش کنید.');
    return err;
  }
}

const submitButton =
  'flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-l from-primary-500 to-primary-600 py-3 text-sm font-bold text-white shadow-card transition-all duration-200 hover:from-primary-600 hover:to-primary-700 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-70';

export default function Login() {
  const navigation = useNavigation();
  const isSubmiting = navigation.state === 'submitting';
  const errors = useActionData<{ msg?: string }>();

  return (
    <AuthShell
      title="ورود به زودمیز"
      subtitle="خوش آمدید! برای دیدن داشبورد رستوران وارد شوید."
      footer={
        <>
          حساب کاربری ندارید؟{' '}
          <Link to="/dashboard/register" className="font-bold text-primary-700 hover:text-primary-800 dark:text-primary-300">
            ثبت‌نام رستوران
          </Link>
        </>
      }
    >
      <Form method="post" className="space-y-1">
        <FormRow type="email" labelText="ایمیل" name="email" placeholder="you@restaurant.ir" isLeftAligned />
        <FormRow type="password" labelText="رمز عبور" name="password" placeholder="••••••••" isLeftAligned />

        {errors?.msg && (
          <div className="mb-4 rounded-xl border-e-4 border-rose-500 bg-rose-50/80 p-3 text-right">
            <p className="text-xs font-bold text-rose-600 dark:text-rose-300">
              نام کاربری یا کلمه عبور اشتباه است
            </p>
          </div>
        )}

        <button type="submit" disabled={isSubmiting} className={submitButton}>
          {isSubmiting ? <FaSpinner className="h-3.5 w-3.5 animate-spin" /> : <FaSignInAlt className="h-3.5 w-3.5" />}
          {isSubmiting ? 'در حال ورود…' : 'ورود به حساب'}
        </button>
      </Form>

      <div className="mt-5 rounded-xl border border-primary-200 bg-primary-50/70 p-4 text-right dark:border-primary-500/30 dark:bg-primary-500/10">
        <p className="text-xs font-bold text-primary-800 dark:text-primary-200">
          اطلاعات ورود آزمایشی · کبابی شاندیز
        </p>
        <dl className="mt-3 space-y-2 text-xs text-gray-700 dark:text-gray-300">
          <div className="flex items-center justify-between gap-3">
            <dt>ایمیل</dt>
            <dd dir="ltr" className="select-all font-mono">demo.shandiz@zoodmiz.ir</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt>رمز عبور</dt>
            <dd dir="ltr" className="select-all font-mono">zoodmiz1234</dd>
          </div>
        </dl>
        <Form method="post" className="mt-4">
          <input className="hidden" name="email" type="email" value="demo.shandiz@zoodmiz.ir" readOnly />
          <input className="hidden" name="password" type="password" value="zoodmiz1234" readOnly />
          <button
            type="submit"
            disabled={isSubmiting}
            className="w-full rounded-xl border border-primary-200 bg-white/80 py-2.5 text-xs font-bold text-primary-800 transition-all duration-200 hover:bg-white disabled:opacity-70 dark:border-primary-500/30 dark:bg-gray-800/70 dark:text-primary-200 dark:hover:bg-gray-800"
          >
            {isSubmiting ? 'در حال ورود…' : 'ورود با حساب آزمایشی'}
          </button>
        </Form>
      </div>
    </AuthShell>
  );
}
