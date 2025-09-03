import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product.jsx";
import Cart from "./Pages/Cart.jsx";
import LoginSignup from "./Pages/LoginSignup.jsx";
import Footer from "./Components/Footer/Footer";
import men_banner from "./assets/Assets/banner_mens.png";
import women_banner from "./assets/Assets/banner_women.png";
import kids_banner from "./assets/Assets/banner_kids.png";
import PaymentGateway from "./Components/PaymentGateway/PaymentGateway";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));
  }, []);

  const addToCart = (product) => {
    fetch("http://localhost:5000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    }).then(() => setCart([...cart, product]));
  };

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/shop" element={<Shop />} />
        <Route
          path="/Mens"
          element={<ShopCategory banner={men_banner} category="men" />}
        />
        <Route
          path="/Womens"
          element={<ShopCategory banner={women_banner} category="women" />}
        />
        <Route
          path="/Kids"
          element={<ShopCategory banner={kids_banner} category="kid" />}
        />
        <Route path="/product" element={<Product />}>
          <Route path=":productId" element={<Product />} />
        </Route>
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<LoginSignup />} />
        <Route
          path="/checkout"
          element={
            <PaymentGateway
              amount={1000}
              onSuccess={() => alert("Payment Success!")}
              onFailure={() => alert("Payment Failed!")}
            />
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
