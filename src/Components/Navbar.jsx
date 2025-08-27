import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/assets/logo.png";
import cart_icon from "../assets/assets/cart_icon.png";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <h2> StyleNest</h2>
      </div>

      <ul className="nav-menu">
        <li>
          <NavLink
            to="/shop"
            className={() => {
              return window.location.pathname === "/" ||
                window.location.pathname === "/shop"
                ? "active"
                : "";
            }}
          >
            Shop
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Mens"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Men
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Womens"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Women
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/Kids"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            Kids
          </NavLink>
        </li>
      </ul>

      <div className="nav-login-cart">
        <NavLink to="/login">
          <button>Login</button>
        </NavLink>
        <img src={cart_icon} alt="Cart" />
        <div className="cart-count">0</div>
      </div>
    </div>
  );
};

export default Navbar;
