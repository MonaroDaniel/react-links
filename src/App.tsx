import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Admin from "./pages/admin/Admin";
import Private from "./routes/Private";
import Networks from "./pages/networks/Networks";

const router = createBrowserRouter([
  {
    path: '/',
    element: <Private><Home /></Private>
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/admin',
    element: <Private><Admin /></Private>
  },
  {
    path: '/admin/social',
    element: <Private><Networks /></Private>
  },
])

export { router };