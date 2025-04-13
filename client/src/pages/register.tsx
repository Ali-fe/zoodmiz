import { Form, Link, redirect } from "react-router-dom";
import FormRow from "../components/formrow";
import customFetch from "../utils/customFetch";

export const action = async ({ request }: { request: Request }) => {
  const formdata = await request.formData();
  const data = Object.fromEntries(formdata);
  try {
    await customFetch.post('/auth/register',data);
    return redirect('/login');
  }
  catch (err) {
    alert(err.response.data.msg);
    return err;
  }
}

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 pt-25">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">ثبت نام</h2>
        <Form method="post">
          <FormRow type="text" labelText="نام" name="name" defaultValue="" />
          <FormRow type="text" labelText="نام خانوادگی" name="lastName" defaultValue="" />
          <FormRow type="tel" labelText="شماره همراه" name="phone" defaultValue="" />
          <FormRow type="text" labelText="آدرس" name="address" defaultValue="" />
          <FormRow type="text" name="restaurantName" labelText="نام رستوران" defaultValue="" />
          <FormRow type="email" labelText="ایمیل" name="email" defaultValue="ایمیل" />
          <FormRow type="password" labelText="رمز عبور" name="password" defaultValue="" />
          <FormRow type="password" labelText="تکرار کلمه عبور" name="repeatedPass" defaultValue="" />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">ثبت نام</button>
        </Form>
        <p className="text-center text-sm text-gray-600 mt-4">
          حساب کاربری دارید؟ <Link to="/login" className="text-blue-500">وارد شوید</Link>
        </p>
      </div>
    </div>
  )
}