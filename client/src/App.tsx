import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import {
  HomeLayout,
  Landing,
  Login,
  Register,
  DashboardLayout,
  Error,
  Overview,
  Profile
} from './pages'
import {action as resigterAction} from './pages/register';

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
          element: <Register/>,
          action: resigterAction
        }

      ]
    },
    {
      path:'dashboard',
      element : <DashboardLayout/>,
      children:[
        {
          index: true,
          element: <Overview/>
        },
        {
          path:'profile',
          element: <Profile/>
        },
        {
          path:'menu',
          element: <Profile/>
        },
        {
          path:'edibles',
          element: <Profile/>
        },
        {
          path:'orders',
          element: <Profile/>
        },
        {
          path:'edible',
          element: <Profile/>
        }
      ]
    }
  ]
);

function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App
