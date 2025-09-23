// src/Components/CartItems/CartItems.jsx
import React, { useContext, useState } from "react";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../../assets/Assets/cart_cross_icon.png";
import { useNavigate } from "react-router-dom";

const CartItems = () => {
  const {
    getCartDetails,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getTotalCartAmount,
    applyCoupon,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const cartDetails = getCartDetails();
  const [couponCode, setCouponCode] = useState("");
  // console.log("====================================");
  // console.log(cartDetails);
  // console.log("====================================");

  // 🛒 Checkout handler
  const handleCheckout = () => {
    navigate("/checkout");
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      applyCoupon(couponCode.trim().toUpperCase());
      setCouponCode("");
    }
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {cartDetails.length > 0 ? (
        cartDetails.map((item) => (
          <div key={item.id}>
            <div className="cartitems-format">
              <img src={item.image} alt="" className="carticon-product-icon" />
              <p>{item.name}</p>
              <p>${item.oldPrice}</p>

              <div className="cartitems-quantity-controls">
                <button onClick={() => removeFromCart(item.id)}>-</button>
                <span className="cartitems-quantity">{item.qty}</span>
                <button onClick={() => addToCart(item.id)}>+</button>
              </div>

              {/* <p>${item.price * item.qty}</p> */}
              <p>${item.oldPrice * item.qty}</p>
              <img
                src={remove_icon}
                onClick={() => deleteFromCart(item.id)}
                alt="remove"
                className="cartitems-remove-icon"
              />
            </div>
            <hr />
          </div>
        ))
      ) : (
        <div className="cart-empty">
          <h2>Your cart is empty 🛒</h2>
        </div>
      )}

      {/* Cart Summary */}
      {cartDetails.length > 0 && (
        <div className="cartitems-down">
          <div className="cartitems-total">
            <h1>Cart Total</h1>
          </div>
          <div className="cartitems-total-item">
            <p>Subtotals</p>
            <p>${getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cartitems-total-items">
            <p>Shipping Fee</p>
            <p>Free</p>
          </div>
          <hr />
          <div className="cartitems-total-items">
            <h3>Total</h3>
            <h3>${getTotalCartAmount()}</h3>
          </div>
          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
      )}

      {/* Promo Code */}
      <div className="cartitems-promocode">
        <p>If you have a promo code, Enter it here</p>
        <div>
          <input
            type="text"
            placeholder="Enter your code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <button onClick={handleApplyCoupon}>APPLY</button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
