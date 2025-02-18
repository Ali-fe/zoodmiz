

import './index.css'
import { AddTodoForm } from './components/AddTodoForm';
import { TodoList } from './components/TodoList';
import { TodoSummary } from './components/TodoSummary';
import useTodo from './hooks/useTodo';
function App() {
  
  const{
    todos,
    addTodo,
    onTodoCompleted,
    deleteItem,
    deleteCompletedItem
  }= useTodo();

  return (
    <main className='py-10 h-screen bg-slate-50 space-y-5 font-vazirmatn'>
      <h1 className='font-bold text-2xl text-center'>لیست کارهای شما</h1>
      <div className='max-w-lg mx-auto bg-slate-200 p-5 rounded-md space-y-6'>
        <AddTodoForm onSubmit={addTodo} />
        <TodoList todos={todos} onTodoCompleted={onTodoCompleted} onDelete={deleteItem}/>
      </div>
      <TodoSummary todos={todos} onDeleteCompleted={deleteCompletedItem}/> 
    </main>
  )
}
export default App
