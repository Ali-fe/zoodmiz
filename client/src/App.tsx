import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import {
  HomeLayout,
  Landing,
  Login,
  Register,
  Dashboard,
  Error,
} from './pages'
import DashboardError from './pages/dashboard/dashboarderror';

import { action as resigterAction } from './pages/register';
import { action as loginAction } from './pages/login';
import { loader as dashboardLoader } from './pages/dashboard/dashboard';
import { Menu, Edibles, Orders, Edible, Overview, Profile, Settings, Tables, Images } from './pages/dashboard/index';

const router = createBrowserRouter([
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
      },
      {
        path: 'dashboard',
        errorElement: <DashboardError />,
        children: [
          {
            element: <Dashboard />,
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
              },
              {
                path: 'edible/:id',
                element: <Edible />
              },
              {
                path: 'settings',
                element: <Settings />
              },
              {
                path: 'tables',
                element: <Tables />
              },
              {
                path: 'images',
                element: <Images />
              }
            ]
          }
        ]
      }
    ]
  }
]);

function App() {
  return <RouterProvider router={router} />
}

export default App
