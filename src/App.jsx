import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product.jsx";
import Cart from "./Pages/Cart.jsx";
import LoginSignup from "./Pages/LoginSignup.jsx";
import Footer from "./Components/Footer/Footer";
import PaymentGateway from "./Components/PaymentGateway/PaymentGateway";

import men_banner from "./assets/Assets/banner_mens.png";
import women_banner from "./assets/Assets/banner_women.png";
import kids_banner from "./assets/Assets/banner_kids.png";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Load products
  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch(() => toast.error("Failed to load products"));
  }, []);

  // Load cart depending on currentUser
  useEffect(() => {
    if (currentUser) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      fetch(`http://localhost:5000/cart?userId=${currentUser.id}`)
        .then((res) => res.json())
        .then(async (data) => {
          // Merge guest cart items into user cart
          for (let item of guestCart) {
            const exists = data.find((i) => i.productId === item.id);
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
          localStorage.removeItem("guestCart"); // Clear guest cart
          const res2 = await fetch(
            `http://localhost:5000/cart?userId=${currentUser.id}`
          );
          const updatedCart = await res2.json();
          setCart(updatedCart);
        })
        .catch(() => toast.error("Failed to load cart"));
    } else {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      setCart(guestCart);
    }
  }, [currentUser]);

  // Add to cart
  const addToCart = (product) => {
    if (currentUser) {
      const productWithUser = {
        ...product,
        userId: currentUser.id,
        productId: product.id,
      };
      fetch("http://localhost:5000/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productWithUser),
      })
        .then(() =>
          fetch(`http://localhost:5000/cart?userId=${currentUser.id}`)
        )
        .then((res) => res.json())
        .then((data) => {
          setCart(data);
          toast.success(`${product.name} added to cart!`);
        })
        .catch(() => toast.error("Failed to add product to cart"));
    } else {
      // Guest cart
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
    setCart([]); // Clear cart
    localStorage.removeItem("guestCart"); // Optional
  };

  const categories = [
    { path: "mens", banner: men_banner, cat: "men" },
    { path: "womens", banner: women_banner, cat: "women" },
    { path: "kids", banner: kids_banner, cat: "kid" },
  ];

  return (
    <BrowserRouter>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <Navbar cart={cart} currentUser={currentUser} logout={logout} />
      <Routes>
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
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
