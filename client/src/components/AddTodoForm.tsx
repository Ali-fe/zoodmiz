import { useState } from "react"

interface AddTodoFormProps {
    onSubmit: (title:string)=> void
}
export function AddTodoForm({onSubmit}:AddTodoFormProps) {
    const [input,setInput] = useState("");
    function handlesubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault();
        if(!input.trim()) return;
        onSubmit(input);
        setInput("");

    }
    return (
        <form onSubmit={handlesubmit} 
        className="flex justify-end">
            <button
             type="submit" 
             className="px-2 bg-slate-700 text-white rounded-s-md hover:bg-slate-800">
                اضافه کن
                </button>
            <input 
            value={input}
            onChange={(e)=> setInput(e.target.value)}
            className="bg-white text-right grow p-2 rounded-e-md"
            placeholder="چه کاری میخواهید انجام دهید؟"
            type="text" 
            />
    
        </form>
    )
}