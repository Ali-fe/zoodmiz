import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import {
  HomeLayout,
  Landing,
  Login,
  Register,
  Dashboard,
  Error,
  Overview,
  Profile
} from './pages'

import { action as resigterAction } from './pages/register';
import { action as loginAction } from './pages/login';
import { loader as dashboardLoader } from './pages/dashboard/dashboard';
import Menu from './pages/dashboard/menu';
import Edibles from './pages/dashboard/edibles';
import Orders from './pages/dashboard/orders';
import Edible from './pages/dashboard/edible';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomeLayout />,
      errorElement: <Error />,
      children: [
        {
          index: true,
          element: <Landing />
        },
        {
          path: 'login',
          element: <Login />,
          action: loginAction
        },
        {
          path: 'register',
          element: <Register />,
          action: resigterAction
        }
      ]
    },
    {
      path: 'dashboard',
      element: <Dashboard />,
      errorElement: <Error />,
      loader: dashboardLoader,

      children: [
        {
          index: true,
          element: <Overview />
        },
        {
          path: 'profile',
          element: <Profile />
        },
        {
          path: 'menu',
          element: <Menu />
        },
        {
          path: 'edibles',
          element: <Edibles />
        },
        {
          path: 'orders',
          element: <Orders />
        },
        {
          path: 'edible',
          element: <Edible />
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
