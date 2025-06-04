import { useState, useEffect } from 'react';
import { FaSpinner, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import customFetch from '../../utils/customFetch';
import { useDashboardContext } from './dashboard';
import { useNavigate } from 'react-router-dom';

interface Edible {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageURL?: string;
  category: string;
}

const Edibles = () => {
  const { isDarkTheme } = useDashboardContext();
  const navigate = useNavigate();
  const [edibles, setEdibles] = useState<Edible[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<{ url: string; name: string } | null>(null);

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

  const handleDelete = async (id: string) => {
    try {
      await customFetch.delete(`/edibles/${id}`);
      setEdibles(edibles.filter(edible => edible._id !== id));
    } catch (error) {
      console.error('Error deleting edible:', error);
    }
  };

  useEffect(() => {
    fetchEdibles();
  }, []);

  return (
    <div className={`p-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className={`text-xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
          لیست غذاها
        </h1>
        <button
          onClick={() => navigate('/dashboard/edible')}
          className={`px-4 py-2 rounded-md transition-colors duration-200 shadow-md hover:shadow-lg
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
          <FaSpinner className={`animate-spin text-4xl ${
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
                <th className={`py-3 px-4 border-b text-right font-semibold ${
                  isDarkTheme ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'
                }`}>تصویر</th>
                <th className={`py-3 px-4 border-b text-right font-semibold ${
                  isDarkTheme ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'
                }`}>نام غذا</th>
                <th className={`py-3 px-4 border-b text-right font-semibold ${
                  isDarkTheme ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'
                }`}>توضیحات</th>
                <th className={`py-3 px-4 border-b text-right font-semibold ${
                  isDarkTheme ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'
                }`}>قیمت (تومان)</th>
                <th className={`py-3 px-4 border-b text-right font-semibold ${
                  isDarkTheme ? 'text-gray-200 border-gray-600' : 'text-gray-700 border-gray-200'
                }`}>دسته‌بندی</th>
                <th className={`py-3 px-4 border-b text-right font-semibold ${
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
                  <td className="py-3 px-4 border-b">
                    {edible.imageURL ? (
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img
                          src={edible.imageURL}
                          alt={edible.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <span className={`text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                        بدون تصویر
                      </span>
                    )}
                  </td>
                  <td className={`py-3 px-4 border-b ${
                    isDarkTheme ? 'text-gray-200' : 'text-gray-700'
                  }`}>{edible.name}</td>
                  <td className={`py-3 px-4 border-b ${
                    isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                  }`}>{edible.description}</td>
                  <td className={`py-3 px-4 border-b font-semibold ${
                    isDarkTheme ? 'text-blue-400' : 'text-blue-600'
                  }`}>{edible.price.toLocaleString()}</td>
                  <td className={`py-3 px-4 border-b ${
                    isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                  }`}>{edible.category}</td>
                  <td className="py-3 px-4 border-b">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => navigate(`/dashboard/edible/${edible._id}`)}
                        className={`p-2 rounded-md transition-colors duration-200 ${
                          isDarkTheme 
                            ? 'text-blue-400 hover:bg-gray-700 hover:text-blue-300' 
                            : 'text-blue-600 hover:bg-gray-100 hover:text-blue-500'
                        }`}
                      >
                        <FaEdit className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDelete(edible._id)}
                        className={`p-2 rounded-md transition-colors duration-200 ${
                          isDarkTheme 
                            ? 'text-red-400 hover:bg-gray-700 hover:text-red-300' 
                            : 'text-red-600 hover:bg-gray-100 hover:text-red-500'
                        }`}
                      >
                        <FaTrash className="text-lg" />
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
    </div>
  );
};

export default Edibles; 