import { useCallback, useEffect, useState } from 'react';
import {
  FaCheck,
  FaImage,
  FaTrash,
} from 'react-icons/fa';
import customFetch from '../../utils/customFetch';
import { showToast } from '../../utils/toast';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  Modal,
  PageHeader,
  Panel,
} from '../../components/dashboard/ui';
import { toPersianNumber } from '../../utils/persianNumbers';

interface ImageItem {
  url: string;
  name: string;
}

const serverMessage = (error: unknown, fallback: string) =>
  (error as { response?: { data?: { msg?: string } } })?.response?.data?.msg || fallback;

const Images = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSelectMode = location.state?.selectMode;
  const navigatePath = location.state?.navigatePath;
  const previousState = location.state?.previousState || {};
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    setErrorMessage(undefined);
    try {
      const { data } = await customFetch.get('/edibles/images');
      setImages(data.images as ImageItem[]);
    } catch (error) {
      setErrorMessage(serverMessage(error, 'خطا در دریافت لیست تصاویر'));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await customFetch.delete(`/edibles/images/${encodeURIComponent(deleteTarget)}`);
      setImages((prev) => prev.filter((img) => img.url !== deleteTarget));
      setSelectedImages((prev) => {
        const next = new Set(prev);
        next.delete(deleteTarget);
        return next;
      });
      showToast.success('تصویر با موفقیت حذف شد');
    } catch (error) {
      showToast.error(serverMessage(error, 'خطا در حذف تصویر'));
    } finally {
      setDeleteTarget(null);
    }
  };

  const handleBack = () => {
    navigate(navigatePath, { state: { previousState } });
  };

  const handleImageSelect = (imageUrl: string) => {
    if (isSelectMode) {
      navigate(navigatePath, {
        state: { previousState, selectedImage: imageUrl },
        replace: true,
      });
      return;
    }
    toggleImageSelection(imageUrl);
  };

  const toggleImageSelection = (imageUrl: string) => {
    setSelectedImages((prev) => {
      const next = new Set(prev);
      if (next.has(imageUrl)) next.delete(imageUrl);
      else next.add(imageUrl);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedImages.size === 0) return;
    const urls = Array.from(selectedImages);
    try {
      await Promise.all(
        urls.map((url) => customFetch.delete(`/edibles/images/${encodeURIComponent(url)}`))
      );
      setImages((prev) => prev.filter((img) => !urls.includes(img.url)));
      setSelectedImages(new Set());
      showToast.success('تصاویر انتخاب‌شده با موفقیت حذف شدند');
    } catch (error) {
      showToast.error(serverMessage(error, 'خطا در حذف تصاویر'));
    }
  };

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  return (
    <div className="p-4">
      <PageHeader
        icon={<FaImage />}
        title={isSelectMode ? 'انتخاب تصویر' : 'گالری تصاویر'}
        subtitle={
          loading
            ? 'در حال خواندن تصاویر…'
            : `${toPersianNumber(images.length)} تصویر در کتابخانه رستوران`
        }
        actions={
          <>
            {isSelectMode && (
              <Button tone="neutral" variant="outline" onClick={handleBack}>
                بازگشت
              </Button>
            )}
            {!isSelectMode && selectedImages.size > 0 && (
              <Button tone="danger" icon={<FaTrash />} onClick={handleBulkDelete}>
                حذف {toPersianNumber(selectedImages.size)} تصویر
              </Button>
            )}
          </>
        }
      />

      {loading ? (
        <LoadingState rows={3} label="در حال بارگذاری تصاویر…" />
      ) : errorMessage ? (
        <ErrorState message={errorMessage} onRetry={fetchImages} />
      ) : images.length === 0 ? (
        <EmptyState
          icon={<FaImage />}
          title="هنوز تصویری آپلود نشده است"
          hint={
            isSelectMode
              ? 'برای افزودن تصویر، از بخش خوراکی‌ها یک فایل بارگذاری کنید.'
              : 'تصاویری که برای غذاها آپلود می‌کنید اینجا جمع می‌شوند.'
          }
        />
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {images.map((image) => {
            const isSelected = selectedImages.has(image.url);
            return (
              <Panel
                key={image.url}
                className={`group relative overflow-hidden transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-primary' : 'hover:shadow-lift'
                }`}
              >
                <button
                  type="button"
                  onClick={() => handleImageSelect(image.url)}
                  aria-label={isSelectMode ? `انتخاب ${image.name}` : `انتخاب تصویر ${image.name}`}
                  className="block w-full text-right"
                >
                  <span className="block aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
                    <img
                      src={image.url}
                      alt={image.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(event) => {
                        const target = event.target as HTMLImageElement;
                        target.src = '/photos/placeholder.png';
                        target.onerror = null;
                      }}
                    />
                  </span>

                  <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/80 to-transparent px-2.5 pb-2 pt-6 text-[11px] font-bold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
                    <span className="block truncate">{image.name}</span>
                  </span>

                  {isSelected && (
                    <span className="absolute end-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-primary text-white shadow-card">
                      <FaCheck className="h-3 w-3" />
                    </span>
                  )}
                </button>

                {!isSelectMode && (
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(image.url)}
                    aria-label={`حذف تصویر ${image.name}`}
                    className="absolute start-2 top-2 grid h-7 w-7 place-items-center rounded-lg bg-white/90 text-rose-600 opacity-0 shadow-card transition-all duration-200 hover:bg-white focus-visible:opacity-100 group-hover:opacity-100 [&>svg]:h-3 [&>svg]:w-3"
                  >
                    <FaTrash />
                  </button>
                )}
              </Panel>
            );
          })}
        </div>
      )}

      {deleteTarget && (
        <Modal
          title="تایید حذف تصویر"
          onClose={() => setDeleteTarget(null)}
          footer={
            <>
              <Button tone="neutral" variant="outline" onClick={() => setDeleteTarget(null)}>
                انصراف
              </Button>
              <Button tone="danger" icon={<FaTrash />} onClick={handleDelete}>
                حذف
              </Button>
            </>
          }
        >
          <div className="flex items-center gap-3">
            <img
              src={deleteTarget}
              alt=""
              className="h-16 w-16 shrink-0 rounded-xl object-cover ring-1 ring-gray-200 dark:ring-gray-700"
            />
            <p className="text-sm text-gray-600 dark:text-gray-300">
              این تصویر برای همیشه حذف می‌شود. اگر غذا یا رستورانی از آن استفاده می‌کند، جای آن خالی
              می‌ماند.
            </p>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Images;
