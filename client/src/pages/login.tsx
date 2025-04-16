import { Form, Link,useNavigation,redirect, useActionData } from "react-router-dom";
import FormRow from "../components/formrow";
import{ toast} from 'react-toastify';
import customFetch from "../utils/customFetch";

export const action = async ({ request }: { request: Request }) => {
  const formdata = await request.formData();
  const data = Object.fromEntries(formdata);
  try {
    await customFetch.post('/auth/login',data);
    toast.success('شما با موفقیت وارد شدید')
    return redirect('/dashboard');
  }
  catch (error:any) {
    error.msg = error?.response?.data?.msg;
    return error;
  }
}

export default function Login() {
  const navigation = useNavigation();
  const isSubmiting = navigation.state === 'submitting';
  const errors = useActionData();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-25">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">ورود به حساب</h2>
        <Form method="post" className="flex flex-col space-y-4 text-right">
          <FormRow type="email" labelText="ایمیل" name="email" defaultValue="ایمیل" />
          <FormRow type="password" labelText="رمز عبور" name="password" defaultValue="رمز عبور" />
          {errors?.msg && <p style={{color:'red'}}>{errors.msg}</p>}
          <button type="submit" className="bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600">
            {isSubmiting? 'در حال ورود ...' : 'ورود'}
          </button>
          <button type="submit" className="bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600">
            {isSubmiting?'در حال ورود':'ورود آزمایشی'}
          </button>
          
        </Form>
        <p className="text-center text-gray-600 mt-4">
          حساب کاربری ندارید؟ <Link to="/register" className="text-blue-500">ثبت‌نام</Link>
        </p>
      </div>
    </div>
  )
}