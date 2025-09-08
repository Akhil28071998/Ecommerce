import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/assets/logo.png";
import cart_icon from "../assets/assets/cart_icon.png";
import { ShopContext } from "../Context/ShopContext";
import { AuthContext } from "../Context/AuthContext";

const Navbar = () => {
  const { getTotalCartItems } = useContext(ShopContext);
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <h2>StyleNest</h2>
      </div>

      <ul className="nav-menu">
        <li>
          <NavLink to="/shop">Shop</NavLink>
        </li>
        <li>
          <NavLink to="/Mens">Men</NavLink>
        </li>
        <li>
          <NavLink to="/Womens">Women</NavLink>
        </li>
        <li>
          <NavLink to="/Kids">Kids</NavLink>
        </li>
      </ul>

      <div className="nav-login-cart">
        {currentUser ? (
          <div className="navbar-user">
            <span>Hello, {currentUser.name}</span> {/* Display user name */}
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <NavLink to="/login">
            <button>Login</button>
          </NavLink>
        )}

        <Link to="/cart" className="nav-cart">
          <img src={cart_icon} alt="Cart" />
          <div className="nav-cart-count">{getTotalCartItems()}</div>
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
