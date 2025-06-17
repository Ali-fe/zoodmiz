import { useState, useRef, useEffect } from 'react';
import { FaSpinner, FaArrowRight, FaImage } from 'react-icons/fa';
import customFetch from '../../utils/customFetch';
import { useDashboardContext } from './dashboard';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import { edibleType } from '../../data/data';

// --- کامپوننت ورودی متنی ---
const TextInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  ...props
}: any) => {
  const { isDarkTheme } = useDashboardContext();
  return (
    <div>
      <label className={`block text-xs font-medium mb-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${isDarkTheme
          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
        } focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 ${className}`}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

// --- کامپوننت سلکت ---
const SelectInput = ({
  label,
  name,
  value,
  onChange,
  children,
  className = '',
  ...props
}: any) => {
  const { isDarkTheme } = useDashboardContext();
  return (
    <div>
      <label className={`block text-xs font-medium mb-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${isDarkTheme
          ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
          : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
        } focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

// --- کامپوننت تکست اریا ---
const TextAreaInput = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  rows = 4,
  className = '',
  ...props
}: any) => {
  const { isDarkTheme } = useDashboardContext();
  return (
    <div>
      <label className={`block text-xs font-medium mb-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-2.5 py-1.5 text-sm rounded-md border ${isDarkTheme
          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500'
          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500'
        } focus:ring-1 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-200 resize-none ${className}`}
        rows={rows}
        placeholder={placeholder}
        {...props}
      />
    </div>
  );
};

// --- فرم اصلی ---
const EdibleForm = () => {
  const { isDarkTheme } = useDashboardContext();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    type: '',
    imageURL: '',
    discount: '0'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch edible data if editing

  const fetchEdible = async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const { data } = await customFetch.get(`/edibles/${id}`);
      const edible = data.edible;
      setFormData({
        name: edible.name,
        description: edible.description,
        price: edible.price.toString(),
        type: edible.type,
        imageURL: edible.imageURL || '',
        discount : edible.discount ? edible.discount.toString() : '0'
      });
      if (data.edible.imageURL) {
        setPreviewImage(data.edible.imageURL);
      }
    } catch (error) {
      showToast.error('خطا در دریافت اطلاعات خوراکی');
      navigate('/dashboard/edibles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
  
    if (location.state?.selectedImage) {
      setFormData({ ...location.state?.previousState, imageURL: location.state.selectedImage });
      setPreviewImage(location.state.selectedImage);
    }
    else if (location.state?.previousState) {
      setFormData(location.state.previousState);
      setPreviewImage(location.state.previousState.imageURL);
    }
    else if(id) { 
      fetchEdible();
    }
  }, [id, navigate]);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showToast.error('فرمت فایل مجاز نیست. فقط تصاویر JPEG، PNG و GIF مجاز هستند.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast.error('حجم فایل نباید بیشتر از 5 مگابایت باشد.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await customFetch.post('/edibles/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.url) {
        setFormData(prev => ({ ...prev, imageURL: res.data.url }));
        showToast.success('تصویر با موفقیت آپلود شد');
      } else {
        throw new Error('آدرس تصویر دریافت نشد');
      }
    } catch (error) {
      showToast.error('خطا در آپلود تصویر. لطفاً دوباره تلاش کنید.');
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showToast.error('فرمت فایل مجاز نیست. فقط تصاویر JPEG، PNG و GIF مجاز هستند.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast.error('حجم فایل نباید بیشتر از 5 مگابایت باشد.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const res = await customFetch.post('/edibles/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (res.data.url) {
        setFormData(prev => ({ ...prev, imageURL: res.data.url }));
        showToast.success('تصویر با موفقیت آپلود شد');
      } else {
        throw new Error('آدرس تصویر دریافت نشد');
      }
    } catch (error) {
      showToast.error('خطا در آپلود تصویر. لطفاً دوباره تلاش کنید.');
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (id) {
        // ویرایش خوراکی
        await customFetch.patch(`/edibles/${id}`, {
          ...formData,
          price: Number(formData.price)
        });
        showToast.success('خوراکی با موفقیت ویرایش شد');
      } else {
        // افزودن خوراکی
        await customFetch.post('/edibles', {
          ...formData,
          price: Number(formData.price)
        });
        showToast.success('خوراکی با موفقیت اضافه شد');
      }
      navigate('/dashboard/edibles');
    } catch (error) {
      showToast.error(id ? 'خطا در ویرایش خوراکی' : 'خطا در افزودن خوراکی');
    } finally {
      setIsSubmitting(false);
    }
  };

  // تابع فرمت اعداد با ویرگول
  const formatNumberWithCommas = (value: string) => {
    const num = value.replace(/,/g, '');
    if (!num) return '';
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // هندل تغییر مقدار ورودی قیمت
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (!/^\d*$/.test(rawValue)) return; // فقط اعداد مجاز است
    setFormData(prev => ({
      ...prev,
      price: rawValue
    }));
  };
  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {  
    const rawValue = e.target.value.replace(/,/g, '');
    if (!/^\d*$/.test(rawValue)) return;
    if (Number(rawValue)<0 || Number(rawValue) > 100 ) return;
    setFormData(prev => ({
      ...prev,
      discount: rawValue
    }));
  }

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center min-h-[400px] ${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <FaSpinner className={`animate-spin text-3xl ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
      </div>
    );
  }

  return (
    <div className={`${isDarkTheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="mx-auto">
        <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4`}>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate('/dashboard/edibles')}
              className={`p-1.5 rounded-md transition-colors duration-200 ${isDarkTheme ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
                }`}
            >
              <FaArrowRight className="text-lg" />
            </button>
            <h1 className={`text-lg font-bold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
              {id ? 'ویرایش خوراکی' : 'افزودن خوراکی'}
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* ستون سمت راست - فرم اطلاعات خوراکی */}
            <div className="md:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextInput
                  label="نام خوراکی"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="نام خوراکی را وارد کنید"
                  required
                />
                <SelectInput
                  label="نوع"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="">انتخاب نوع</option>
                  {edibleType.map(type => {return <option value={type}>{type}</option>})}
                </SelectInput>
                
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <TextInput
                  label="قیمت (تومان)"
                  name="price"
                  value={formatNumberWithCommas(formData.price)}
                  onChange={handlePriceChange}
                  placeholder="قیمت را وارد کنید"
                  required
                  inputMode="numeric"
                  pattern="[0-9,]*"
                />
                <TextInput
                  label="تخفیف (درصد)"
                  name="discount"
                  value={formData.discount}
                  onChange={handleDiscountChange}
                  placeholder="درصد تخیفیف را وارد کنید"
                  required
                  inputMode="numeric"
                  pattern="[0-9,]*"
                />
              </div>
              <TextAreaInput
                label="توضیحات"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="توضیحات خوراکی را وارد کنید"
                rows={4}
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/edibles')}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium ${isDarkTheme
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-all duration-200 transform hover:-translate-y-0.5`}
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium ${isDarkTheme
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                  } transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50`}
                >
                  {isSubmitting ? (
                    <FaSpinner className="animate-spin inline-block ml-1.5" />
                  ) : null}
                  {isSubmitting ? 'در حال ثبت...' : 'ثبت'}
                </button>
              </div>
            </div>
            {/* ستون سمت چپ - آپلود تصویر */}
            <div className="md:col-span-5 flex flex-col">
              <label className={`block text-xs font-medium mb-1 ${isDarkTheme ? 'text-gray-300' : 'text-gray-700'}`}>
                تصویر خوراکی
              </label>
              <div
                className={`flex flex-col ${isDarkTheme ? 'bg-gray-700/50' : 'bg-gray-50'
                  } rounded-md border-2 border-dashed ${isDarkTheme ? 'border-gray-600' : 'border-gray-300'
                  } ${isDragging ? 'border-blue-500 bg-blue-50/50' : 'hover:border-blue-500'} transition-colors duration-200`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center p-3">
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <FaSpinner className={`animate-spin w-10 h-10 mb-2 ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
                      <p className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                        در حال آپلود تصویر...
                      </p>
                    </div>
                  ) : (
                    <>
                      <svg
                        className={`w-10 h-10 mb-2 ${isDarkTheme ? 'text-gray-400' : 'text-gray-300'}`}
                        stroke="currentColor"
                        fill="none"
                        viewBox="0 0 48 48"
                        aria-hidden="true"
                      >
                        <path
                          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <label
                            htmlFor="image"
                            className={`relative cursor-pointer rounded-md text-sm font-medium ${isDarkTheme
                              ? 'text-blue-400 hover:text-blue-300'
                              : 'text-blue-600 hover:text-blue-500'
                            } focus-within:outline-none`}
                          >
                            <span>آپلود تصویر</span>
                            <input
                              id="image"
                              type="file"
                              ref={fileInputRef}
                              onChange={handleImageUpload}
                              accept="image/*"
                              className="sr-only"
                              disabled={isUploading}
                            />
                          </label>
                          <span className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>یا</span>
                          <button
                            onClick={(e) => {
                              e.preventDefault(); navigate('/dashboard/images', {
                                state: {
                                  selectMode: true,
                                  previousState: formData,
                                  navigatePath: location.pathname
                                }
                              })
                            }}
                            className={`text-sm font-medium ${isDarkTheme
                              ? 'text-blue-400 hover:text-blue-300'
                              : 'text-blue-600 hover:text-blue-500'
                            }`}
                          >
                            انتخاب از تصاویر موجود
                          </button>
                        </div>
                        <p className={`mt-0.5 text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                          یا فایل را اینجا رها کنید
                        </p>
                        <p className={`text-xs mt-0.5 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                          PNG, JPG, GIF تا 5MB
                        </p>
                      </div>
                    </>
                  )}
                </div>
                {previewImage && (
                  <div className="relative rounded-b-md overflow-hidden">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="w-100 h-100 object-cover"
                    />
                  </div>
                )}
                {formData.imageURL && (
                  <div className={`p-1.5 text-xs text-center ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                    <FaImage className="inline-block ml-1" />
                    تصویر با موفقیت آپلود شد
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EdibleForm;