import { useState, useEffect } from 'react';
import { FaSpinner, FaTrash, FaTimes, FaCheck, FaImage, FaArrowRight } from 'react-icons/fa';
import customFetch from '../../utils/customFetch';
import { useDashboardContext } from './dashboard';
import { showToast } from '../../utils/toast';
import { useLocation, useNavigate } from 'react-router-dom';

interface Image {
  url: string;
  name: string;
}

const Images = () => {
  const { isDarkTheme } = useDashboardContext();
  const location = useLocation();
  const navigate = useNavigate();
  const isSelectMode = location.state?.selectMode;
  const previousState = location.state?.previousState || {};
  const edibleId = location.state?.edibleId || 0;
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; imageUrl: string | null }>({
    isOpen: false,
    imageUrl: null
  });

  const fetchImages = async () => {
    setLoading(true);
    try {
      const { data } = await customFetch.get('/edibles/images');
      // Ensure URLs are properly formatted

      setImages(data.images);
    } catch (error) {
      showToast.error('خطا در دریافت لیست تصاویر');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.imageUrl) return;
    try {
      await customFetch.delete(`/edibles/images/${encodeURIComponent(deleteModal.imageUrl)}`);
      setImages(images.filter(img => img.url !== deleteModal.imageUrl));
      showToast.success('تصویر با موفقیت حذف شد');
    } catch (error) {
      showToast.error('خطا در حذف تصویر');
    } finally {
      setDeleteModal({ isOpen: false, imageUrl: null });
    }
  };
  const handleBack = () => {
    navigate("/dashboard/edible/" + edibleId, {
      state: {
        previousState,
      }
    });
  };
  const handleImageSelect = (imageUrl: string) => {
    if (isSelectMode) {
      navigate("/dashboard/edible/" + edibleId, {
        state: {
          previousState,
          selectedImage: imageUrl
        },
        replace: true
      });
    } else {
      toggleImageSelection(imageUrl);
    }
  };

  const toggleImageSelection = (imageUrl: string) => {
    setSelectedImages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(imageUrl)) {
        newSet.delete(imageUrl);
      } else {
        newSet.add(imageUrl);
      }
      return newSet;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedImages.size === 0) return;

    try {
      await Promise.all(
        Array.from(selectedImages).map(url =>
          customFetch.delete(`/edibles/images/${encodeURIComponent(url)}`)
        )
      );
      setImages(images.filter(img => !selectedImages.has(img.url)));
      setSelectedImages(new Set());
      showToast.success('تصاویر انتخاب شده با موفقیت حذف شدند');
    } catch (error) {
      showToast.error('خطا در حذف تصاویر');
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <FaSpinner className={`animate-spin text-3xl ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className={`${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-4`}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3 mb-4">
            <button
               onClick={handleBack} 
              className={`p-1.5 rounded-md transition-colors duration-200 ${
                isDarkTheme ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              <FaArrowRight className="text-lg" />
            </button>
            <h1 className={`text-lg font-bold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
              {isSelectMode ? 'انتخاب تصویر' : 'مدیریت تصاویر'}
            </h1>
          </div>

          {!isSelectMode && selectedImages.size > 0 && (
            <button
              onClick={handleBulkDelete}
              className={`px-3 py-1.5 text-sm rounded-md font-medium ${isDarkTheme
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-500 hover:bg-red-600 text-white'
                } transition-all duration-200`}
            >
              حذف {selectedImages.size} تصویر انتخاب شده
            </button>
          )}
        </div>

        {images.length === 0 ? (
          <div className={`flex flex-col items-center justify-center py-12 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'
            }`}>
            <FaImage className="text-4xl mb-4" />
            <p>هیچ تصویری یافت نشد</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square rounded-lg overflow-hidden group ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = '/photos/placeholder.png';
                    target.onerror = null;
                  }}
                />
                <div className={`absolute inset-0 bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-200 flex items-center justify-center`}>
                  <div className="flex gap-2">
                    {isSelectMode ? (
                      <button
                        onClick={() => handleImageSelect(image.url)}
                        className={`p-2 rounded-full transition-colors duration-200 ${isDarkTheme
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        <FaCheck />
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => toggleImageSelection(image.url)}
                          className={`p-2 rounded-full transition-colors duration-200 ${selectedImages.has(image.url)
                              ? 'bg-green-500 text-white'
                              : isDarkTheme
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-white text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                          <FaCheck />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ isOpen: true, imageUrl: image.url })}
                          className={`p-2 rounded-full transition-colors duration-200 ${isDarkTheme
                              ? 'bg-gray-700 text-red-400 hover:bg-gray-600'
                              : 'bg-white text-red-600 hover:bg-gray-100'
                            }`}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* مودال تایید حذف */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`relative max-w-md w-full mx-4 ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden`}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                تایید حذف تصویر
              </h3>
              <button
                onClick={() => setDeleteModal({ isOpen: false, imageUrl: null })}
                className={`p-2 rounded-full transition-colors duration-200 ${isDarkTheme
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100'
                  }`}
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-4">
              <p className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                آیا از حذف این تصویر اطمینان دارید؟
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, imageUrl: null })}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium ${isDarkTheme
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    } transition-all duration-200`}
                >
                  انصراف
                </button>
                <button
                  onClick={handleDelete}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium ${isDarkTheme
                      ? 'bg-red-600 hover:bg-red-700 text-white'
                      : 'bg-red-500 hover:bg-red-600 text-white'
                    } transition-all duration-200`}
                >
                  حذف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Images; 