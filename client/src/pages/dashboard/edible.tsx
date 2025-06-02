import { useState } from 'react';
import { FaSpinner, FaArrowRight } from 'react-icons/fa';
import axios from 'axios';
import { useDashboardContext } from './dashboard';
import { useNavigate } from 'react-router-dom';

const EdibleForm = () => {
  const { isDarkTheme } = useDashboardContext();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageURL: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post('/api/edibles', {
        ...formData,
        price: Number(formData.price)
      });
      navigate('/dashboard/edibles');
    } catch (error) {
      console.error('Error adding edible:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`p-6 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard/edibles')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isDarkTheme ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-500'
            }`}
          >
            <FaArrowRight className="text-xl" />
          </button>
          <h1 className={`text-3xl font-bold ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
            افزودن غذا
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-700'
            }`}>
              نام غذا
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isDarkTheme 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              placeholder="نام غذا را وارد کنید"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-700'
            }`}>
              توضیحات
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isDarkTheme 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              rows={3}
              placeholder="توضیحات غذا را وارد کنید"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-700'
            }`}>
              قیمت (تومان)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isDarkTheme 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              placeholder="قیمت را وارد کنید"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-700'
            }`}>
              دسته‌بندی
            </label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isDarkTheme 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              placeholder="دسته‌بندی را وارد کنید"
            />
          </div>
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              isDarkTheme ? 'text-gray-300' : 'text-gray-700'
            }`}>
              آدرس تصویر
            </label>
            <input
              type="url"
              name="imageURL"
              value={formData.imageURL}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500
                ${isDarkTheme 
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              placeholder="آدرس تصویر را وارد کنید"
            />
          </div>
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard/edibles')}
              className={`px-4 py-2 rounded-md transition-colors duration-200 ${
                isDarkTheme 
                  ? 'text-gray-300 hover:text-white' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}
            >
              انصراف
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`px-6 py-2 rounded-md transition-colors duration-200 disabled:opacity-50 shadow-md hover:shadow-lg
                ${isDarkTheme 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
            >
              {isSubmitting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                'افزودن'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EdibleForm;