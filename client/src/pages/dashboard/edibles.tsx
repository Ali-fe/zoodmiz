import { useState, useEffect } from 'react';
import { FaPlus, FaSpinner, FaEdit, FaTrash } from 'react-icons/fa';
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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-xl font-bold text-right ${
          isDarkTheme ? 'text-white' : 'text-gray-900'
        }`}>
          غذاها
        </h2>
        <button
          onClick={() => navigate('/dashboard/edible')}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg
            ${isDarkTheme 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
        >
          <FaPlus className="text-lg" />
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
    </div>
  );
};

export default Edibles; 