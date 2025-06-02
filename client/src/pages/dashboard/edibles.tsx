import { useState, useEffect } from 'react';
import { FaPlus, FaSpinner } from 'react-icons/fa';
import axios from 'axios';
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
      const response = await axios.get('/api/edibles');
      setEdibles(response.data.edibles);
    } catch (error) {
      console.error('Error fetching edibles:', error);
    } finally {
      setLoading(false);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {edibles.map((edible) => (
            <div 
              key={edible._id} 
              className={`rounded-xl shadow-lg overflow-hidden transition-shadow duration-200 hover:shadow-xl
                ${isDarkTheme ? 'bg-gray-800' : 'bg-white'}`}
            >
              {edible.imageURL && (
                <img
                  src={edible.imageURL}
                  alt={edible.name}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className={`text-lg font-semibold mb-2 ${
                  isDarkTheme ? 'text-white' : 'text-gray-900'
                }`}>
                  {edible.name}
                </h2>
                <p className={`mb-4 line-clamp-2 ${
                  isDarkTheme ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {edible.description}
                </p>
                <div className={`text-lg font-bold ${
                  isDarkTheme ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  {edible.price.toLocaleString()} تومان
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Edibles; 