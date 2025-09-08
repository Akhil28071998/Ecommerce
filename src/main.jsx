import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import ShopProvider from "./Context/ShopContext.jsx";
import AuthProvider from "./Context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <ShopProvider>
        <App />
        <ToastContainer />
      </ShopProvider>
    </AuthProvider>
  </React.StrictMode>
);
