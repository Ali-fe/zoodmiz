import { useState, useRef, useEffect } from 'react';
import {
  FaArrowRight,
  FaImage,
  FaSave,
  FaSpinner,
  FaTrash,
  FaUpload,
} from 'react-icons/fa';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { showToast } from '../../utils/toast';
import customFetch from '../../utils/customFetch';
import { edibleType } from '../../data/data';
import { SelectInput, TextAreaInput, TextInput } from '../../components/dashboard/inputs';
import {
  Badge,
  Button,
  LoadingState,
  PageHeader,
  Panel,
  Switch,
} from '../../components/dashboard/ui';
import CoverArt from '../../components/coverart';
import { useCreateEdible, useUpdateEdible, useEdible } from '../../hooks/useEdibles';

const EdibleForm = () => {
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
    discount: '0',
    menu: false,
    available: false,
  });

  const [isUploading, setIsUploading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { data: edibleData, isLoading } = useEdible(id);

  const { mutate: createEdible, isPending: isCreating } = useCreateEdible();
  const { mutate: updateEdible, isPending: isUpdating } = useUpdateEdible(() => {
    navigate('/dashboard/edibles');
  });
  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (location.state?.selectedImage) {
      setFormData({ ...location.state?.previousState, imageURL: location.state.selectedImage });
      setPreviewImage(location.state.selectedImage);
    } else if (location.state?.previousState) {
      setFormData(location.state.previousState);
      setPreviewImage(location.state.previousState.imageURL);
    } else if (id && edibleData) {
      setFormData({
        name: edibleData.name,
        description: edibleData.description,
        price: edibleData.price.toString(),
        type: edibleData.type,
        imageURL: edibleData.imageURL || '',
        discount: edibleData.discount ? edibleData.discount.toString() : '0',
        menu: edibleData.menu || false,
        available: edibleData.available || false,
      });
      if (edibleData.imageURL) {
        setPreviewImage(edibleData.imageURL);
      }
    }
  }, [id, edibleData, location.state]);

  // محدودیت‌های همان قواعد اعتبارسنجی سمت سرور
  const validateForm = () => {
    const errors: Record<string, string> = {};
    const name = formData.name.trim();
    if (name.length < 3 || name.length > 50) {
      errors.name = 'نام خوراکی باید بین ۳ تا ۵۰ نویسه باشد';
    }
    const description = formData.description.trim();
    if (description.length < 5 || description.length > 300) {
      errors.description = 'توضیحات باید بین ۵ تا ۳۰۰ نویسه باشد';
    }
    return errors;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => (prev[name] ? { ...prev, [name]: '' } : prev));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const readAndKeepFile = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      showToast.error('فرمت فایل مجاز نیست. فقط تصاویر JPEG، PNG و GIF مجاز هستند.');
      return false;
    }
    if (file.size > 5 * 1024 * 1024) {
      showToast.error('حجم فایل نباید بیشتر از 5 مگابایت باشد.');
      return false;
    }
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
    setSelectedFile(file);
    return true;
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    try {
      const payload = new FormData();
      payload.append('image', file);
      const res = await customFetch.post('/edibles/upload', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.url) {
        setFormData((prev) => ({ ...prev, imageURL: res.data.url }));
        showToast.success('تصویر با موفقیت آپلود شد');
        setSelectedFile(null);
      } else {
        throw new Error('آدرس تصویر دریافت نشد');
      }
    } catch {
      showToast.error('خطا در آپلود تصویر. لطفاً دوباره تلاش کنید.');
      setPreviewImage(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readAndKeepFile(file);
  };

  const handleConfirmUpload = () => {
    if (selectedFile) uploadFile(selectedFile);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (readAndKeepFile(file)) await uploadFile(file);
  };

  const clearImage = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    setFormData((prev) => ({ ...prev, imageURL: '' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateForm();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const submissionData = {
      ...formData,
      price: Number(formData.price),
      discount: Number(formData.discount),
    };

    if (id) {
      updateEdible({ id, data: submissionData });
    } else {
      createEdible(submissionData);
    }
  };

  // فرمت اعداد با جداکننده هزارگان برای نمایش در ورودی
  const formatNumberWithCommas = (value: string) => {
    const num = value.replace(/,/g, '');
    if (!num) return '';
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (!/^\d*$/.test(rawValue)) return;
    setFormData((prev) => ({ ...prev, price: rawValue }));
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, '');
    if (!/^\d*$/.test(rawValue)) return;
    if (Number(rawValue) < 0 || Number(rawValue) > 100) return;
    setFormData((prev) => ({ ...prev, discount: rawValue }));
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <PageHeader title={id ? 'ویرایش خوراکی' : 'افزودن خوراکی'} subtitle="در حال خواندن اطلاعات…" />
        <LoadingState rows={4} />
      </div>
    );
  }

  const price = Number(formData.price || 0);
  const discount = Number(formData.discount || 0);
  const finalPrice = Math.round(price * (1 - discount / 100));

  return (
    <div className="p-4">
      <PageHeader
        title={id ? 'ویرایش خوراکی' : 'افزودن خوراکی'}
        subtitle="اطلاعاتی که اینجا می‌نویسید، مستقیم در منوی مشتری نمایش داده می‌شود."
        icon={<FaImage />}
        actions={
          <Button
            tone="neutral"
            variant="outline"
            icon={<FaArrowRight />}
            onClick={() => navigate('/dashboard/edibles')}
          >
            بازگشت به فهرست
          </Button>
        }
      />

      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:items-start">
        <div className="space-y-4 lg:col-span-7">
          <Panel className="space-y-4 p-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <TextInput
                label="نام خوراکی"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="نام خوراکی را وارد کنید"
                error={fieldErrors.name}
                required
              />
              <SelectInput label="نوع" name="type" value={formData.type} onChange={handleInputChange}>
                <option value="">انتخاب نوع</option>
                {edibleType.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </SelectInput>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                placeholder="درصد تخفیف را وارد کنید"
                required
                inputMode="numeric"
                pattern="[0-9,]*"
              />
            </div>

            {discount > 0 && price > 0 && (
              <div className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs dark:bg-emerald-500/10">
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  قیمت نهایی برای مشتری
                </span>
                <span className="font-bold text-emerald-700 dark:text-emerald-300">
                  {formatNumberWithCommas(String(finalPrice))} تومان
                </span>
              </div>
            )}

            <TextAreaInput
              label="توضیحات"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="توضیحات خوراکی را وارد کنید (حداقل ۵ نویسه)"
              error={fieldErrors.description}
              rows={4}
              hint="مواد اصلی، اندازه یا نکته‌ای که این آیتم را خاص می‌کند بنویسید."
            />
          </Panel>

          <Panel className="p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-gray-800 dark:text-gray-100">تصویر خوراکی</h2>
              {formData.imageURL && (
                <Badge tone="success">
                  <FaImage className="h-2.5 w-2.5" />
                  تصویر آماده است
                </Badge>
              )}
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-xl border-2 border-dashed p-3 transition-colors duration-200 ${
                isDragging
                  ? 'border-primary-500 bg-primary-50/70 dark:border-primary-400 dark:bg-primary-500/10'
                  : 'border-gray-200 bg-gray-50/70 hover:border-primary-300 dark:border-gray-600 dark:bg-gray-900/40'
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center gap-2 py-6">
                  <FaSpinner className="h-8 w-8 animate-spin text-primary-500" />
                  <p className="text-xs text-gray-600 dark:text-gray-300">در حال آپلود تصویر…</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 py-4 text-center">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary-50 text-primary-500 dark:bg-primary-500/15 dark:text-primary-300">
                    <FaUpload className="h-4 w-4" />
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
                    <label htmlFor="image" className="cursor-pointer font-bold text-primary-700 hover:text-primary-800 dark:text-primary-300">
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
                    <span className="text-xs text-gray-400">یا</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        navigate('/dashboard/images', {
                          state: {
                            selectMode: true,
                            previousState: formData,
                            navigatePath: location.pathname,
                          },
                        });
                      }}
                      className="text-sm font-bold text-primary-700 hover:text-primary-800 dark:text-primary-300"
                    >
                      انتخاب از گالری
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    فایل را اینجا رها کنید · PNG، JPG، GIF تا ۵ مگابایت
                  </p>
                </div>
              )}

              {(previewImage || formData.imageURL) && (
                <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-gray-100 pt-3 dark:border-gray-700">
                  <CoverArt
                    name={formData.name || 'خوراکی'}
                    src={previewImage || formData.imageURL}
                    className="h-20 w-20 shrink-0 rounded-xl"
                    textClass="text-xl"
                  />
                  <div className="flex-1 text-xs text-gray-500 dark:text-gray-400">
                    پیش‌نمایش تصویر انتخابی
                  </div>
                  {selectedFile && !isUploading && (
                    <Button type="button" onClick={handleConfirmUpload}>
                      آپلود این فایل
                    </Button>
                  )}
                  <Button
                    type="button"
                    tone="danger"
                    variant="outline"
                    icon={<FaTrash />}
                    onClick={clearImage}
                  >
                    برداشتن
                  </Button>
                </div>
              )}
            </div>
          </Panel>
        </div>

        {/* ستون چپ: همان چیزی که مشتری می‌بیند */}
        <div className="space-y-4 lg:col-span-5">
          <Panel className="p-4">
            <h2 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-100">پیش‌نمایش در منو</h2>
            <div className="rounded-xl border border-gray-100 bg-cream p-2.5 dark:border-gray-700 dark:bg-gray-900/40">
              <CoverArt
                name={formData.name || 'خوراکی'}
                src={previewImage || formData.imageURL}
                className="mb-2.5 h-28 w-full rounded-lg"
                textClass="text-3xl"
              />
              <p className="text-sm font-bold text-gray-800 dark:text-white">
                {formData.name || 'نام خوراکی'}
              </p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                {formData.description || 'توضیحی وارد نشده است؛ مشتری این جای خالی را می‌بیند.'}
              </p>
              <div className="mt-2 flex items-center gap-2">
                {discount > 0 && price > 0 && (
                  <span className="text-xs line-through text-gray-400">
                    {formatNumberWithCommas(formData.price)}
                  </span>
                )}
                <span className="text-sm font-bold text-primary-700 dark:text-primary-300">
                  {formatNumberWithCommas(String(discount > 0 ? finalPrice : price)) || '—'}
                  <span className="ms-1 text-[11px] font-normal text-gray-500">تومان</span>
                </span>
                {discount > 0 && <Badge tone="danger">{discount}٪ تخفیف</Badge>}
                {formData.type && <Badge tone="primary">{formData.type}</Badge>}
              </div>
            </div>
          </Panel>

          <Panel className="p-4">
            <h2 className="mb-3 text-sm font-bold text-gray-800 dark:text-gray-100">وضعیت نمایش</h2>
            <div className="space-y-2.5 text-sm">
              <ToggleRow
                label="در منوی فروش"
                hint="در صفحه سفارش روز نمایش داده می‌شود."
                checked={formData.menu}
                onChange={(checked) => setFormData((prev) => ({ ...prev, menu: checked }))}
              />
              <ToggleRow
                label="موجود"
                hint="خاموش بودن یعنی تمام شده؛ مشتری نمی‌تواند سفارش دهد."
                checked={formData.available}
                onChange={(checked) => setFormData((prev) => ({ ...prev, available: checked }))}
              />
            </div>
          </Panel>

          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              tone="neutral"
              variant="outline"
              onClick={() => navigate('/dashboard/edibles')}
            >
              انصراف
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              icon={isSubmitting ? <FaSpinner className="animate-spin" /> : <FaSave />}
            >
              {isSubmitting ? 'در حال ثبت…' : id ? 'ذخیره تغییرات' : 'ثبت خوراکی'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

const ToggleRow = ({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <div className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 px-3 py-2.5 transition-colors hover:border-primary-200 dark:border-gray-700">
    <div className="min-w-0">
      <p className="text-xs font-bold text-gray-700 dark:text-gray-200">{label}</p>
      <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">{hint}</p>
    </div>
    <Switch checked={checked} onChange={() => onChange(!checked)} label={label} />
  </div>
);

export default EdibleForm;
