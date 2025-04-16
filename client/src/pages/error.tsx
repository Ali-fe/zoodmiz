import { Link, useRouteError } from "react-router-dom";

export default function Error(){
    const error= useRouteError();
    console.log(error);
    return (
        <div dir="rtl">
        <h1>مشکلی در بارگذاری صفحه به وجود آمده است.</h1>
        <Link to='/'>بازگشت به خانه</Link>
        </div>
    )
}