import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Painel from './pages/Painel'
import Usuario from './pages/Usuario'

const router = createBrowserRouter([
  {
    path: "/Home",
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
    path: "/painel",
    element: (
      <Painel/>
    ),
  },
  {
    path: "/usuario",
    element: (
      <Usuario/>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);