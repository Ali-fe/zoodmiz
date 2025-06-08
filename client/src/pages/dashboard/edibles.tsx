import { useState, useEffect } from 'react';
import { FaSpinner, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import customFetch from '../../utils/customFetch';
import { useDashboardContext } from './dashboard';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../utils/toast';

interface Edible {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageURL?: string;
  type: string;
}

const Edibles = () => {
  const { isDarkTheme } = useDashboardContext();
  const navigate = useNavigate();
  const [edibles, setEdibles] = useState<Edible[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; edible: Edible | null }>({
    isOpen: false,
    edible: null
  });

  const fetchEdibles = async () => {
    try {
      const { data } = await customFetch.get('/edibles');
      setEdibles(data.edibles);
    } catch (error) {
      console.error('Error fetching edibles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.edible) return;

    try {
      await customFetch.delete(`/edibles/${deleteModal.edible._id}`);
      setEdibles(edibles.filter(edible => edible._id !== deleteModal.edible?._id));
      showToast.success('غذا با موفقیت حذف شد');
    } catch (error) {
      showToast.error('خطا در حذف غذا');
    } finally {
      setDeleteModal({ isOpen: false, edible: null });
    }
  };

  useEffect(() => {
    fetchEdibles();
  }, []);

  return (
    <div className={`p-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex justify-between items-center mb-4">
        <h1 className={`text-lg font-bold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
          لیست خوراکی
        </h1>
        <button
          onClick={() => navigate('/dashboard/edible')}
          className={`px-3 py-1.5 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg text-sm
            ${isDarkTheme 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
        >
          افزودن غذا
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <FaSpinner className={`animate-spin text-3xl ${
            isDarkTheme ? 'text-blue-400' : 'text-blue-600'
          }`} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className={`min-w-full border rounded-lg ${
            isDarkTheme 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          }`}>
            <thead>
              <tr className={isDarkTheme ? 'bg-gray-700' : 'bg-gray-50'}>
                <th className={`py-2 px-3 border-b text-right font-semibold text-sm ${
                  isDarkTheme ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'
                }`}>تصویر</th>
                <th className={`py-2 px-3 border-b text-right font-semibold text-sm ${
                  isDarkTheme ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'
                }`}>نام غذا</th>
                <th className={`py-2 px-3 border-b text-right font-semibold text-sm ${
                  isDarkTheme ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'
                }`}>توضیحات</th>
                <th className={`py-2 px-3 border-b text-right font-semibold text-sm ${
                  isDarkTheme ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'
                }`}>قیمت (تومان)</th>
                <th className={`py-2 px-3 border-b text-right font-semibold text-sm ${
                  isDarkTheme ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'
                }`}>نوع</th>
                <th className={`py-2 px-3 border-b text-right font-semibold text-sm ${
                  isDarkTheme ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'
                }`}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {edibles.map((edible) => (
                <tr key={edible._id} className={`${
                  isDarkTheme 
                    ? 'hover:bg-gray-700 border-gray-600' 
                    : 'hover:bg-gray-50 border-gray-200'
                }`}>
                  <td className="py-2 px-3 border-b">
                    {edible.imageURL ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden">
                        <img
                          src={edible.imageURL}
                          alt={edible.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className={`text-xs ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                        بدون تصویر
                      </span>
                    )}
                  </td>
                  <td className={`py-2 px-3 border-b text-sm ${
                    isDarkTheme ? 'text-gray-200' : 'text-gray-700'
                  }`}>{edible.name}</td>
                  <td className={`py-2 px-3 border-b text-sm ${
                    isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                  }`}>{edible.description}</td>
                  <td className={`py-2 px-3 border-b font-semibold text-sm ${
                    isDarkTheme ? 'text-blue-400' : 'text-blue-600'
                  }`}>{edible.price.toLocaleString()}</td>
                  <td className={`py-2 px-3 border-b text-sm ${
                    isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                  }`}>{edible.type}</td>
                  <td className="py-2 px-3 border-b">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/edible/${edible._id}`)}
                        className={`p-1.5 rounded-md transition-colors duration-200 ${
                          isDarkTheme 
                            ? 'text-blue-400 hover:bg-blue-500/20' 
                            : 'text-blue-600 hover:bg-blue-100'
                        }`}
                      >
                        <FaEdit className="text-sm" />
                      </button>
                      <button
                        onClick={() => setDeleteModal({ isOpen: true, edible })}
                        className={`p-1.5 rounded-md transition-colors duration-200 ${
                          isDarkTheme 
                            ? 'text-red-400 hover:bg-red-500/20' 
                            : 'text-red-600 hover:bg-red-100'
                        }`}
                      >
                        <FaTrash className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`relative max-w-2xl w-full mx-4 ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden`}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                {selectedImage.name}
              </h3>
              <button
                onClick={() => setSelectedImage(null)}
                className={`p-2 rounded-full transition-colors duration-200 ${
                  isDarkTheme 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaTimes className="text-xl" />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedImage.url}
                alt={selectedImage.name}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* مودال تایید حذف */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`relative max-w-sm w-full mx-4 ${isDarkTheme ? 'bg-gray-800' : 'bg-white'} rounded-lg overflow-hidden`}>
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className={`text-base font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
                تایید حذف
              </h3>
              <button
                onClick={() => setDeleteModal({ isOpen: false, edible: null })}
                className={`p-1.5 rounded-full transition-colors duration-200 ${
                  isDarkTheme 
                    ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                    : 'text-gray-500 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                <FaTimes className="text-lg" />
              </button>
            </div>
            <div className="p-4">
              <p className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                آیا از حذف غذا "{deleteModal.edible?.name}" اطمینان دارید؟
              </p>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => setDeleteModal({ isOpen: false, edible: null })}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium ${
                    isDarkTheme
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } transition-all duration-200`}
                >
                  انصراف
                </button>
                <button
                  onClick={handleDelete}
                  className={`px-3 py-1.5 text-sm rounded-md font-medium ${
                    isDarkTheme 
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

export default Edibles; 