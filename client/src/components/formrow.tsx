
const FormRow = ({type,labelText,name,defaultValue}:{type:string,labelText:string,name:string,defaultValue:string})=>{
    return(
      <div className="mb-4">
            <label htmlFor={name} className="block text-gray-700 text-sm mb-2">{labelText}</label>
            <input type={type} name={name} id={name} required
            placeholder={defaultValue} className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>
    )
  }
  export default FormRow;