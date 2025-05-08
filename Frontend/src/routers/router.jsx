import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login/Login";
import LoginUser from "../pages/Login/LoginUser";
import LoginAdmin from "../pages/Login/LoginAdmin";
import Schedule from "../pages/Schedule";
import BookingHistory from "../pages/BookingHistory";
import Home_User from "../pages/Home_User";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/schedule",
        element: <Schedule />,
      },
      {
        path: "/history",
        element: <BookingHistory />,
      },
      {
        path: "/home",
        element: <Home_User />,
      },
    ],
  },
  // {
  //   path: "/signup",
  //   element: <Login />,
  // },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/login-user",
    element: <LoginUser />,
  },
  {
    path: "/login-admin",
    element: <LoginAdmin />,
  },
]);

export default router;
