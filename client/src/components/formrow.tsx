
interface FormRowProps {
  type: string;
  name: string;
  labelText: string;
  placeholder ?: string;
  isLeftAligned?: boolean;
}

const FormRow = ({ type, name, labelText, placeholder = '', isLeftAligned = false }: FormRowProps) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="block text-gray-700 text-sm mb-2">{labelText}</label>
      <input
        type={type}
        name={name}
        id={name}
        placeholder ={placeholder }
        className={`w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLeftAligned ? 'text-left' : 'text-right'}`}
      />
    </div>
  );
};

export default FormRow;