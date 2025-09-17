import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import ShopProvider from "./Context/ShopContext.jsx";
import AuthProvider from "./Context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
import "./index.css";
import { ProductProvider } from "./Context/ProductContext"; // <- extension-less import

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ProductProvider>
      <AuthProvider>
        <ShopProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          <ToastContainer />
        </ShopProvider>
      </AuthProvider>
    </ProductProvider>
  </React.StrictMode>
);
