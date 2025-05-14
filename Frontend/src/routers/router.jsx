import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Schedule from "../pages/Schedule";
import BookingHistory from "../pages/BookingHistory";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import UserInfo from "../pages/UserInfo";

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
        path: "/information",
        element: <UserInfo />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

export default router;
