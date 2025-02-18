import { useEffect, useState } from "react";
import { dummyData } from "../data/todos";
import { Todo } from "../types/todo";

export default function useTodo(){
    const [todos, setTodos] = useState(()=>{
        const savedTodos : Todo[] = JSON.parse(localStorage.getItem("todos") || "[]");
        return savedTodos.length> 0 ? savedTodos : dummyData;
      });
    
      useEffect(()=>{
        localStorage.setItem("todos",JSON.stringify(todos));
      },[todos]);
      
      function onTodoCompleted(id: number, completed: boolean) {
        setTodos((prevTodo) => prevTodo.map((todo) => (todo.id === id ? { ...todo, completed } : todo)));
      }
      function addTodo(title: string) {
        setTodos((todos) => [
          {
            id: Date.now(),
            title: title,
            completed: false
          },
          ...todos
        ]);
      }
      function deleteItem(id : number){
        setTodos((prevTodo) => prevTodo.filter(todo=> todo.id!= id));
      }
      function deleteCompletedItem(){
        setTodos((prevTodo) => prevTodo.filter(todo=> !todo.completed));
      }

      return {
        todos,
        onTodoCompleted,
        addTodo,
        deleteItem,
        deleteCompletedItem
      }
}