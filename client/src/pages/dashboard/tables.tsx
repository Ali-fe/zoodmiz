

import { useDashboardContext } from './dashboard';

const Tables = () => { 
    const { isDarkTheme } = useDashboardContext();
  return (
        <div className="p-6">
            <h2 className={`text-l font-bold mb-6 text-right ${isDarkTheme ? 'text-white' : 'text-gray-800'}`}>
            میزها
            </h2>
            
        </div>
    );
};

export default Tables;