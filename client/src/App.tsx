import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import {
  HomeLayout,
  Landing,
  Login,
  Register,
  DashboardLayout,
  Error,
} from './pages'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomeLayout/>,
      errorElement: <Error/>,
      children:[
        {
          index: true,
          element: <Landing/>
        },
        {
          path: 'login',
          element: <Login/>
        },
        {
          path: 'register',
          element: <Register/>
        }
      ]
    }, 
    {
      path:'/dashboard',
      element : <DashboardLayout/>
    }
  ]
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
