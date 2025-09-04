import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import ShopContextprovide from "./Context/ShopContext.jsx";
import AuthProvider from "./Context/AuthContext.jsx";
import { ToastContainer } from "react-toastify";
createRoot(document.getElementById("root")).render(
  <>
    <StrictMode>
      <ShopContextprovide>
        <AuthProvider>
          <App />
          <ToastContainer />
        </AuthProvider>
      </ShopContextprovide>
    </StrictMode>
  </>
);
