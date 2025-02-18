import { Todo } from "../types/todo"

interface TodoSummaryProps {
    todos: Todo[],
    onDeleteCompleted: () => void
}
export function TodoSummary({ todos, onDeleteCompleted }: TodoSummaryProps) {
    const completedItems = todos.filter(todo => todo.completed);
    return (todos.length>0 &&
        <div className="text-center font-medium">
            <p>{completedItems.length}/{todos.length} کار انجام شده</p>  
            {completedItems.length>0 && (<button className="text-red-600" 
            onClick={onDeleteCompleted}>حذف کارهای انجام شده</button>)}
        </div>
    );
}