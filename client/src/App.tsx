import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import { lazy, Suspense } from "react";
// // Lazy load PublicMenu
// const PublicMenu = lazy(() => import("./pages/publicmenu"));
import "./index.css";
import {
  HomeLayout,
  Landing,
  Error,
  PublicMenu
} from "./pages";

import {
  Menu,
  Edibles,
  Orders,
  Edible,
  Overview,
  Profile,
  Settings,
  Tables,
  Images,
  Login,
  Register,
  Dashboard,
  DashboardError
} from "./pages/dashboard/index";

import { action as resigterAction } from "./pages/dashboard/register";
import { action as loginAction } from "./pages/dashboard/login";
import { loader as dashboardLoader } from "./pages/dashboard/dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: "/dashboard/login",
        element: <Login />,
        action: loginAction,
      },
      {
        path: "/dashboard/register",
        element: <Register />,
        action: resigterAction,
      }
    ]
  },
  {
    path: "/dashboard",
    errorElement: <DashboardError />,
    children: [
      {
        element: <Dashboard />,
        loader: dashboardLoader,
        children: [
          {
            index: true,
            element: <Overview />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "menu",
            element: <Menu />,
          },
          {
            path: "edibles",
            element: <Edibles />,
          },
          {
            path: "orders",
            element: <Orders />,
          },
          {
            path: "edible",
            element: <Edible />,
          },
          {
            path: "edible/:id",
            element: <Edible />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
          {
            path: "tables",
            element: <Tables />,
          },
          {
            path: "images",
            element: <Images />,
          },
        ],
      },
    ],
  },
  {
    path: '/restaurants',
    errorElement: <Error />,
    children:[
      {
        path:'menu/:restaurantId/:table',
        element:  <PublicMenu/>
      }
    ]
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
