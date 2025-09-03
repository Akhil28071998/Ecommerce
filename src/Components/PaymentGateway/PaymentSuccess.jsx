import React from "react";
import "./PaymentSuccess.css";
import successIcon from "../assets/assets/success_icon.png";

const PaymentSuccess = () => {
  return (
    <div className="payment-success-container">
      <div className="payment-success-card">
        <img src={successIcon} alt="Success" className="success-icon" />
        <h2>Payment Successful!</h2>
        <p>
          Your order has been placed successfully. Thank you for shopping with
          us!
        </p>
        <button
          className="success-button"
          onClick={() => (window.location.href = "/shop")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
