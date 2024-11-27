import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
  Outlet,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Painel from './pages/Painel'
import Usuario from './pages/Usuario'
import List from './pages/List'
import ProtectedRoute from "./pages/ProtectedRoute";
import AcessDenied from "./pages/AccessDenied";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Home/>
    ),
  },
  {
    path: "/login",
    element: (
      <Login/>
    ),
  },
  {
    path: "/cadastro",
    element: (
      <Cadastro/>
    ),
  },
  {
    path: "/usuario",
    element: (
      <ProtectedRoute errorPage={<AcessDenied />} targetPage={<Outlet />}/>
    ),
    children: [
      {
        path: "",
        element: <Painel/>
      }
    ]
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);