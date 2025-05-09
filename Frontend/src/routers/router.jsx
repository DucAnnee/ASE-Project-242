import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login/Login";
import Schedule from "../pages/Lecturer/Schedule";
import BookingHistory from "../pages/Lecturer/BookingHistory";
import Calender from "../pages/Guest/Calender";
import Home_Lecturer from "../pages/Lecturer/Home_Lecturer";
import Home_Guest from "../pages/Guest/Home_Guest";
import LoginGuest from "../pages/Login/LoginGuest";
import LoginLecturer from "../pages/Login/LoginLecturer";
import Signup from "../pages/Signup/Signup";

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
        element: <Home_Lecturer />,
      },
      {
        path: "/guest/calender",
        element: <Calender />,
      },
      {
        path: "/guest",
        element: <Home_Guest />,
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
    path: "/login-lecturer",
    element: <LoginLecturer />,
  },
  {
    path: "/login-guest",
    element: <LoginGuest />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

export default router;
