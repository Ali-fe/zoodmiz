import { Trash2 } from "lucide-react";
import { Todo } from "../types/todo";

interface TodoItemsProps {
    todo: Todo;
    onCompletedChange: (id:number , completed:boolean)=> void
    onDelete: (id:number)=> void
}
export function TodoItem({todo,onCompletedChange,onDelete}: TodoItemsProps) {
    return (
        <div className="flex items-center gap-1">
            <button 
            onClick={() => onDelete(todo.id)}
            className="p-2">
                <Trash2 size={20} className="text-gray-500"/>
            </button>
            <label className="flex flex-row gap-2 justify-end bg-slate-100  p-2 border bordered-md rounded-md border-gray-400 hover:bg-white font-semibold font-vazirmatn grow">
                <span className={todo.completed? "line-through text-gray-400": ""}>{todo.title}</span>
                <input
                type="checkbox" 
                className="scale-125"
                checked={todo.completed}
                onChange={(e)=>onCompletedChange(todo.id,e.target.checked)}
                />
            </label>
        </div>
    );
}