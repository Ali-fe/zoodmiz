import { FaCog, FaMoon, FaSignOutAlt, FaUserShield } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useDashboardContext } from './dashboard';
import { Badge, Button, PageHeader, Panel, Switch } from '../../components/dashboard/ui';
import { toPersianNumber } from '../../utils/persianNumbers';

const Row = ({
  title,
  hint,
  action,
}: {
  title: string;
  hint: string;
  action: React.ReactNode;
}) => (
  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-50 py-3 last:border-0 dark:border-gray-700/60">
    <div className="min-w-[180px] flex-1">
      <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{title}</p>
      <p className="mt-0.5 text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">{hint}</p>
    </div>
    {action}
  </div>
);

export default function Settings() {
  const { user, isDarkTheme, toggleDarkTheme, logoutUser } = useDashboardContext();

  return (
    <div className="p-4">
      <PageHeader
        icon={<FaCog />}
        title="تنظیمات"
        subtitle="ترجیحات ظاهری و اطلاعات حساب کاربری این رستوران."
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
        <Panel className="p-4">
          <h2 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">ظاهر</h2>
          <Row
            title="حالت شب"
            hint="رنگ‌های تیره برای آشپزخانه و شب‌های شلوغ؛ انتخاب شما در همین مرورگر ذخیره می‌شود."
            action={
              <Switch
                checked={isDarkTheme}
                onChange={toggleDarkTheme}
                label="تغییر حالت شب"
              />
            }
          />
          <Row
            title="فهرست کناری"
            hint="در صفحه‌نمایش کوچک، بخش‌های داشبورد از منوی کناری باز می‌شوند."
            action={
              <Link to="/dashboard">
                <Button tone="neutral" variant="outline">
                  نمای کلی
                </Button>
              </Link>
            }
          />
        </Panel>

        <Panel className="p-4">
          <h2 className="mb-1 flex items-center gap-2 text-sm font-bold text-gray-800 dark:text-gray-100">
            <FaUserShield className="h-3.5 w-3.5 text-primary-500" />
            حساب کاربری
          </h2>
          <Row
            title="نام"
            hint="همان نامی که در گوشه بالای داشبورد می‌بینید."
            action={<Badge tone="primary">{user?.lastName || user?.name || '—'}</Badge>}
          />
          <Row
            title="ایمیل"
            hint="با این ایمیل وارد داشبورد می‌شوید."
            action={
              <span dir="ltr" className="text-xs font-bold text-gray-600 dark:text-gray-300">
                {user?.email || '—'}
              </span>
            }
          />
          <Row
            title="شماره تماس"
            hint="شماره‌ای که در پروفایل رستوران ثبت شده است."
            action={
              <span dir="ltr" className="text-xs font-bold text-gray-600 dark:text-gray-300">
                {user?.phone ? toPersianNumber(user.phone) : '—'}
              </span>
            }
          />
        </Panel>

        <Panel className="p-4 lg:col-span-2">
          <h2 className="mb-1 text-sm font-bold text-gray-800 dark:text-gray-100">دسترسی سریع</h2>
          <div className="flex flex-wrap gap-2 py-3">
            <Link to="/dashboard/profile">
              <Button tone="neutral" variant="outline">
                پروفایل رستوران
              </Button>
            </Link>
            <Link to="/dashboard/edibles">
              <Button tone="neutral" variant="outline">
                خوراکی‌ها
              </Button>
            </Link>
            <Link to="/dashboard/tables">
              <Button tone="neutral" variant="outline">
                میزها
              </Button>
            </Link>
            <Link to="/dashboard/menu">
              <Button tone="neutral" variant="outline" icon={<FaMoon />}>
                ثبت سفارش دستی
              </Button>
            </Link>
            <Button tone="danger" variant="outline" className="ms-auto" icon={<FaSignOutAlt />} onClick={logoutUser}>
              خروج از حساب
            </Button>
          </div>
        </Panel>
      </div>
    </div>
  );
}
