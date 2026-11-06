import { useState, useEffect } from "react";
import { FaMapMarkedAlt, FaSave, FaSpinner, FaStore } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import customFetch from "../../utils/customFetch";
import {
  Button,
  LoadingState,
  PageHeader,
  Panel,
} from "../../components/dashboard/ui";
import { TextInput, TextAreaInput } from "../../components/dashboard/inputs";
import LocationPicker from "../../components/dashboard/locationpicker";

const SectionTitle = ({ icon, title, hint }: { icon?: React.ReactNode; title: string; hint?: string }) => (
  <div className="mb-4 flex items-center gap-2.5">
    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-500/15 dark:text-primary-300 [&>svg]:h-3.5 [&>svg]:w-3.5">
      {icon || <FaStore />}
    </span>
    <div>
      <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">{title}</h2>
      {hint && <p className="text-[11px] text-gray-500 dark:text-gray-400">{hint}</p>}
    </div>
  </div>
);

const ProfileForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    description: "",
    address: {
      street: "",
      city: "",
      postalCode: "",
      buildingNumber: "",
    },
    location: {
      lat: "",
      lng: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchRestaurant = async () => {
    setIsLoading(true);
    try {
      const { data } = await customFetch.get("/restaurants");
      const { restaurant } = data;
      setFormData({
        name: restaurant.name || "",
        phone: restaurant.phone || "",
        description: restaurant.description || "",
        address: {
          street: restaurant.address?.street || "",
          city: restaurant.address?.city || "",
          buildingNumber: restaurant.address?.buildingNumber?.toString() || "",
          postalCode: restaurant.address?.postalCode?.toString() || "",
        },
        location: {
          lat: restaurant.location?.lat?.toString() || "",
          lng: restaurant.location?.lng?.toString() || "",
        },
      });
    } catch {
      showToast.error("خطا در دریافت اطلاعات رستوران");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parentKey, childKey] = name.split(".");
      if (parentKey === "address" || parentKey === "location") {
        setFormData((prev) => ({
          ...prev,
          [parentKey]: {
            ...prev[parentKey],
            [childKey]: value,
          },
        }));
      }
    } else {
      if (name === "name" || name === "phone" || name === "description") {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }
  };

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (/^[0-9]*$/.test(value)) {
      const [parentKey, childKey] = name.split(".");
      if (parentKey === "address") {
        setFormData((prev) => ({
          ...prev,
          [parentKey]: {
            ...prev[parentKey],
            [childKey]: value,
          },
        }));
      }
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        lat: lat.toString(),
        lng: lng.toString(),
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        address: {
          ...formData.address,
          postalCode: Number(formData.address.postalCode),
          buildingNumber: Number(formData.address.buildingNumber),
        },
        location: {
          ...formData.location,
          lat: Number(formData.location.lat),
          lng: Number(formData.location.lng),
        },
      };
      await customFetch.patch("/restaurants", payload);
      showToast.success("اطلاعات با موفقیت بروزرسانی شد");
      navigate("/dashboard");
    } catch {
      showToast.error("خطا در بروزرسانی اطلاعات");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <PageHeader icon={<FaStore />} title="پروفایل رستوران" subtitle="در حال خواندن اطلاعات…" />
        <LoadingState rows={4} />
      </div>
    );
  }

  return (
    <div className="p-4">
      <PageHeader
        icon={<FaStore />}
        title="پروفایل رستوران"
        subtitle="این اطلاعات همان چیزی است که مشتری در صفحه رستوران شما می‌بیند."
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:items-start">
        <div className="space-y-4">
          <Panel className="p-4">
            <SectionTitle title="مشخصات اصلی" hint="نام و راه ارتباطی" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextInput
                label="نام فروشگاه"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <TextInput
                label="شماره تلفن"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="text-left"
                dir="ltr"
              />
            </div>
            <div className="mt-4">
              <TextAreaInput
                label="توضیحات"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                hint="یک یا دو جمله که مشتری را برای سفارش ترغیب کند."
              />
            </div>
          </Panel>

          <Panel className="p-4">
            <SectionTitle title="آدرس" hint="برای ارسال سفارش و نمایش در نقشه" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <TextInput
                label="شهر"
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
              />
              <TextInput
                label="خیابان"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
              />
              <TextInput
                label="پلاک"
                name="address.buildingNumber"
                value={formData.address.buildingNumber}
                onChange={handleNumericInputChange}
                type="text"
                className="text-left"
                dir="ltr"
              />
              <TextInput
                label="کد پستی"
                name="address.postalCode"
                value={formData.address.postalCode}
                onChange={handleNumericInputChange}
                type="text"
                className="text-left"
                dir="ltr"
              />
            </div>
          </Panel>
        </div>

        <Panel className="p-4">
          <SectionTitle
            icon={<FaMapMarkedAlt />}
            title="موقعیت مکانی"
            hint="نقشه را جابه‌جا کنید یا نشانگر را روی فروشگاه بگذارید."
          />
          <LocationPicker
            lat={Number(formData.location.lat) || 35.7219}
            lng={Number(formData.location.lng) || 51.3347}
            onLocationChange={handleLocationChange}
          />
        </Panel>

        <div className="flex items-center justify-between gap-3 lg:col-span-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            تغییرات پس از ذخیره، بلافاصله در صفحه مشتری اعمال می‌شود.
          </p>
          <Button type="submit" disabled={isSubmitting} icon={isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}>
            {isSubmitting ? "در حال ذخیره…" : "ذخیره تغییرات"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
