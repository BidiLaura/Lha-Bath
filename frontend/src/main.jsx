import * as React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, Route, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Painel from './pages/Painel'
import ProtectedRoute from "./pages/ProtectedRoute";
import AcessDenied from "./pages/AccessDenied";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./index.css"; 


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/cadastro",
    element: <Cadastro />,
  },
  {
    path: "/usuario",
    element: <ProtectedRoute errorPage={<AcessDenied />} targetPage={<Outlet />} />,
    children: [
      {
        path: "/usuario/painel",
        element: <Painel />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);

const [darkMode, setDarkMode] = useState(false);
const toggleDarkMode = () => {
  setDarkMode((prevMode) => !prevMode);
};

useEffect(() => {
  if (darkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
}, [darkMode]);