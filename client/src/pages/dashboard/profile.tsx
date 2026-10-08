import { useState, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { useDashboardContext } from "./dashboard";
import { useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toast";
import customFetch from "../../utils/customFetch";
import { TextInput, TextAreaInput } from "../../components/dashboard/inputs";
import LocationPicker from "../../components/dashboard/locationpicker";

const ProfileForm = () => {
  const { isDarkTheme } = useDashboardContext();
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
    } catch (error) {
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
        const [parentKey, childKey] = name.split('.');
         if (parentKey === 'address') {
            setFormData(prev => ({
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
    } catch (error) {
      showToast.error("خطا در بروزرسانی اطلاعات");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div
        className={`flex justify-center items-center min-h-[400px] ${
          isDarkTheme ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <FaSpinner
          className={`animate-spin text-3xl ${
            isDarkTheme ? "text-blue-400" : "text-blue-600"
          }`}
        />
      </div>
    );
  }

  return (
    <div
      className={`mx-auto ${
        isDarkTheme ? "bg-gray-800" : "bg-white"
      } rounded-lg shadow-lg p-6`}
    >
      <div className="flex items-center gap-4 mb-6">
        <h1
          className={`text-l font-bold ${
            isDarkTheme ? "text-white" : "text-gray-800"
          }`}
        >
          پروفایل
        </h1>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12">
          {/* ستون راست (اصلی) */}
          <div className="space-y-8">
            {/* بخش اصلی */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  className = 'text-left'
                  dir='ltr'
                />
              </div>
            </div>
            <TextAreaInput
              label="توضیحات"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
            />

            {/* بخش آدرس */}
            <fieldset className="border-t border-gray-200 dark:border-gray-700 pt-6">
              <legend
                className={`text-base font-semibold mb-4 px-2 ${
                  isDarkTheme ? "text-white" : "text-gray-800"
                }`}
              >
                آدرس
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
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
                  className = 'text-left'
                  dir='ltr'
                />
                <TextInput
                  label="کد پستی"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleNumericInputChange}
                  type="text"
                  className = 'text-left'
                  dir='ltr'
                />
              </div>
            </fieldset>
          </div>

          {/* ستون چپ (موقعیت) */}
          <div className="space-y-8 mt-8 lg:mt-0">
            {/* بخش موقعیت مکانی */}

            <fieldset className="border-t border-gray-200 dark:border-gray-700 pt-6 lg:border-none lg:pt-0">
              <legend
                className={`text-base font-semibold mb-4 px-2 ${
                  isDarkTheme ? "text-white" : "text-gray-800"
                }`}
              >
                موقعیت مکانی
              </legend>
              {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
                  <TextInput label="عرض جغرافیایی (Lat)" name="location.lat" value={formData.location.lat} onChange={handleInputChange} type="number" step="any" />
                  <TextInput label="طول جغرافیایی (Lng)" name="location.lng" value={formData.location.lng} onChange={handleInputChange} type="number" step="any" />
                </div> */}
              <div className="text-sm mb-6">
                <span> موقعیت فروشگاه خود را مشخص کنید.</span>
              </div>

              <LocationPicker
                lat={Number(formData.location.lat) || 35.7219}
                lng={Number(formData.location.lng) || 51.3347}
                onLocationChange={handleLocationChange}
              />
            </fieldset>
          </div>
        </div>

        {/* دکمه ذخیره */}
        <div className="flex justify-end pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-3 py-1.5 text-sm rounded-md text-white transition-all duration-300 transform hover:scale-105
                ${
                  isSubmitting
                    ? isDarkTheme
                      ? "bg-blue-800 cursor-not-allowed"
                      : "bg-blue-400 cursor-not-allowed"
                    : isDarkTheme
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
          >
            {isSubmitting ? (
              <FaSpinner className="animate-spin mx-auto" />
            ) : (
              "ذخیره تغییرات"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
