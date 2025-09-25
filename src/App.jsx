// src/App.jsx
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import Footer from "./Components/Footer/Footer";
import PaymentGateway from "./Components/PaymentGateway/PaymentGateway";

// Admin
import AdminLayout from "./Layout/AdminLayout";
import AdminDashboard from "./Components/AdminPanel/AdminDashboard";
import ManageProduct from "./Components/AdminPanel/ManageProducts";
import ManageOrders from "./Components/AdminPanel/ManageOrders";
import ManageUsers from "./Components/AdminPanel/ManageUsers";
import ProtectedAdminRoute from "./Routes/ProtectedAdminRoute";

import men_banner from "./assets/Assets/banner_mens.png";
import women_banner from "./assets/Assets/banner_women.png";
import kids_banner from "./assets/Assets/banner_kids.png";
import { AuthContext } from "./Context/AuthContext";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const location = useLocation();

  // Hide Navbar/Footer on admin routes
  const isAdminRoute = location.pathname.startsWith("/admin");

  // Fetch products
  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => toast.error("Failed to load products"));
  }, []);

  // Sync cart when user logs in/out
  useEffect(() => {
    const syncCart = async () => {
      if (currentUser) {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        try {
          const res = await fetch(
            `http://localhost:5000/cart?userId=${currentUser.id}`
          );
          const userCart = await res.json();

          // Add guest items to user cart
          for (let item of guestCart) {
            const exists = userCart.find((i) => i.productId === item.id);
            if (!exists) {
              await fetch("http://localhost:5000/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  ...item,
                  userId: currentUser.id,
                  productId: item.id,
                }),
              });
            }
          }

          localStorage.removeItem("guestCart");

          const res2 = await fetch(
            `http://localhost:5000/cart?userId=${currentUser.id}`
          );
          const updatedCart = await res2.json();
          setCart(updatedCart);
        } catch (error) {
          console.error("Failed to load cart"); // ✅ Only log, no toast
        }
      } else {
        const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
        setCart(guestCart);
      }
    };

    syncCart();
  }, [currentUser]);

  // Add product to cart
  const addToCart = async (product) => {
    if (currentUser) {
      const productWithUser = {
        ...product,
        userId: currentUser.id,
        productId: product.id,
      };
      try {
        await fetch("http://localhost:5000/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productWithUser),
        });
        const res = await fetch(
          `http://localhost:5000/cart?userId=${currentUser.id}`
        );
        const data = await res.json();
        setCart(data);
        toast.success(`${product.name} added to cart!`);
      } catch (error) {
        toast.error("Failed to add product to cart");
      }
    } else {
      let guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      guestCart.push(product);
      localStorage.setItem("guestCart", JSON.stringify(guestCart));
      setCart(guestCart);
      toast.info(`${product.name} added to cart (guest)`);
    }
  };

  // Logout
  const logout = () => {
    setCurrentUser(null);
    setCart([]);
    localStorage.removeItem("guestCart");
  };

  // Shop Categories
  const categories = [
    { path: "mens", banner: men_banner, cat: "men" },
    { path: "womens", banner: women_banner, cat: "women" },
    { path: "kids", banner: kids_banner, cat: "kid" },
  ];

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      {!isAdminRoute && (
        <Navbar cart={cart} currentUser={currentUser} logout={logout} />
      )}

      <Routes>
        {/* Shop Routes */}
        <Route
          path="/"
          element={<Shop products={products} addToCart={addToCart} />}
        />
        <Route
          path="/shop"
          element={<Shop products={products} addToCart={addToCart} />}
        />
        {categories.map((c) => (
          <Route
            key={c.path}
            path={`/${c.path}`}
            element={
              <ShopCategory
                banner={c.banner}
                category={c.cat}
                addToCart={addToCart}
              />
            }
          />
        ))}
        <Route
          path="/product/:productId"
          element={<Product addToCart={addToCart} />}
        />
        <Route path="/cart" element={<Cart cart={cart} />} />
        <Route
          path="/login"
          element={<LoginSignup setCurrentUser={setCurrentUser} />}
        />
        <Route path="/checkout" element={<PaymentGateway items={cart} />} />

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route
            path="products"
            element={<ManageProduct setProducts={setProducts} />}
          />
          <Route path="orders" element={<ManageOrders />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
