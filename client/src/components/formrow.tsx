import React from 'react';

interface FormRowProps {
  type: string;
  labelText: string;
  name: string;
  defaultValue: string;
}

const FormRow: React.FC<FormRowProps> = ({type, labelText, name, defaultValue}) => {
    // Determine if the input should be left-aligned (for email and phone)
    const isLeftAligned = type === 'email' || type === 'tel';
    
    return(
      <div className="mb-4 text-right">
            <label htmlFor={name} className="block text-gray-700 text-sm mb-2 font-vazirmatn">{labelText}</label>
            <input 
              type={type} 
              name={name} 
              id={name} 
              required
              dir={isLeftAligned ? "ltr" : "rtl"}
              placeholder={defaultValue} 
              className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-vazirmatn ${isLeftAligned ? 'text-left' : 'text-right'}`}
            />
      </div>
    );
  }

export default FormRow;