import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./CartItems.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../../assets/Assets/cart_cross_icon.png";

const CartItems = () => {
  const {
    getCartDetails,
    addToCart,
    removeFromCart,
    deleteFromCart,
    getTotalCartAmount,
  } = useContext(ShopContext);

  const navigate = useNavigate();
  const cartDetails = getCartDetails();

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
              <p>${item.price}</p>

              <div className="cartitems-quantity-controls">
                <button onClick={() => removeFromCart(item.id)}>-</button>
                <span className="cartitems-quantity">{item.qty}</span>
                <button onClick={() => addToCart(item.id)}>+</button>
              </div>

              <p>${item.price * item.qty}</p>
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
        <p>Your cart is empty.</p>
      )}

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
        <button onClick={() => navigate("/checkout")}>
          PROCEED TO CHECKOUT
        </button>
      </div>

      <div className="cartitems-promocode">
        <p>If you have a promo code, Enter it here</p>
        <div>
          <input type="text" placeholder="Enter your code" />
          <button>APPLY</button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;
