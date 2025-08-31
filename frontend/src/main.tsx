import React from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Claim from "./pages/Claim";
import Family from "./pages/Family";
import PublicView from "./pages/PublicView";

const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/claim", element: <Claim /> },
  { path: "/family/:id", element: <Family /> },
  { path: "/v/:publicId", element: <PublicView /> }

]);

createRoot(document.getElementById("root")!).render(<RouterProvider router={router} />);