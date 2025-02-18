import { Todo } from "../types/todo";
import { TodoItem } from "./todoitem";

interface TodoListProps{
    todos: Todo[],
    onTodoCompleted: (id: number, completed:boolean)=> void,
    onDelete : (id: number ) => void

}
export function TodoList({todos,onTodoCompleted,onDelete}:TodoListProps){

    const sortedTodos = todos.sort((a,b)=> {
        if(a.completed == b.completed)
            return b.id-a.id;
        return a.completed ? 1:-1;
    });

    return(
        <>
        <div className='space-y-1 overflow-y-auto'>
          {sortedTodos.map(todo =>
            <TodoItem
              key={todo.id}
              todo={todo}
              onCompletedChange={onTodoCompleted} 
              onDelete={onDelete}/>
          )}
        </div>
        {todos.length === 0 ?(<div>
            <p className="text-center">
                .کاری وجود ندارد، از بالا اضافه کنید
            </p>
        </div>):""
        }
        </>
    );
}