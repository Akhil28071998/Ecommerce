import React, { useState } from "react";
import "./PaymentGateway.css";

const paymentMethods = [
  {
    value: "paypal",
    label: "PayPal",
    icon: "https://img.icons8.com/color/48/paypal.png",
  },
  {
    value: "creditcard",
    label: "Credit Card",
    icon: "https://img.icons8.com/color/48/bank-card-back-side.png",
  },
  {
    value: "netbanking",
    label: "Net Banking",
    icon: "https://img.icons8.com/color/48/bank-building.png",
  },
  {
    value: "cod",
    label: "Cash on Delivery",
    icon: "https://img.icons8.com/color/48/money.png",
  },
];

const PaymentGateway = ({ amount, onSuccess, onFailure }) => {
  const [selectedOption, setSelectedOption] = useState("");
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [addressSaved, setAddressSaved] = useState(false);
  const orderSummary = {
    items: [
      { name: "T-shirt", qty: 2, price: 499 },
      { name: "Shoes", qty: 1, price: 1299 },
    ],
    total: null,
  };

  // Calculate total
  orderSummary.total = orderSummary.items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  const handlePayment = () => {
    if (!selectedOption) {
      alert("Please select a payment option.");
      return;
    }

    // Simulate payment success
    setTimeout(() => {
      setStep(4); // Go to Success Screen
      if (onSuccess) {
        onSuccess({
          paymentId: "demo123",
          amount: orderSummary.total,
          method: selectedOption,
        });
      }
    }, 1500);
  };

  return (
    <div className="pg-amazon-bg">
      <div className="pg-amazon-container">
        <div className="pg-amazon-sidebar">
          <div className={`pg-step${step === 1 ? " active" : ""}`}>
            1. Address
          </div>
          <div className={`pg-step${step === 2 ? " active" : ""}`}>
            2. Order Summary
          </div>
          <div className={`pg-step${step === 3 ? " active" : ""}`}>
            3. Payment
          </div>
          <div className={`pg-step${step === 4 ? " active" : ""}`}>
            4. Success
          </div>
        </div>

        <div className="pg-amazon-main">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="pg-section">
              <h2 className="pg-title">Delivery Address</h2>
              {!addressSaved ? (
                <form
                  className="pg-address-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAddressSaved(true);
                  }}
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={address.name}
                    required
                    onChange={(e) =>
                      setAddress({ ...address, name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    value={address.phone}
                    required
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Address Line"
                    value={address.address}
                    required
                    onChange={(e) =>
                      setAddress({ ...address, address: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={address.city}
                    required
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={address.state}
                    required
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    value={address.pincode}
                    required
                    onChange={(e) =>
                      setAddress({ ...address, pincode: e.target.value })
                    }
                  />
                  <div className="pg-nav-btns">
                    <button className="pay-btn" type="submit">
                      Save & Continue
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="pg-address-card">
                    <div>
                      <strong>{address.name}</strong>
                    </div>
                    <div>{address.phone}</div>
                    <div>{address.address}</div>
                    <div>
                      {address.city}, {address.state}
                    </div>
                    <div>Pincode: {address.pincode}</div>
                  </div>
                  <div className="pg-nav-btns">
                    <button className="pay-btn" onClick={() => setStep(2)}>
                      Continue
                    </button>
                    <button
                      className="pay-btn"
                      style={{ marginLeft: "16px" }}
                      onClick={() => setAddressSaved(false)}
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="pg-section">
              <h2 className="pg-title">Order Summary</h2>
              <div className="pg-order-card">
                {orderSummary.items.map((item, idx) => (
                  <div key={idx} className="pg-order-item">
                    <span>
                      {item.name} (x{item.qty})
                    </span>
                    <span>${item.price * item.qty}</span>
                  </div>
                ))}
                <div className="pg-order-total">
                  <strong>Total:</strong>
                  <strong>${orderSummary.total}</strong>
                </div>
              </div>
              <div className="pg-nav-btns">
                <button
                  className="pay-btn"
                  onClick={() => setStep(1)}
                  style={{ marginRight: "16px" }}
                >
                  Back
                </button>
                <button className="pay-btn" onClick={() => setStep(3)}>
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="pg-section">
              <h2 className="pg-title">Select Payment Method</h2>
              <div className="pg-methods">
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`pg-method${
                      selectedOption === method.value ? " selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={selectedOption === method.value}
                      onChange={() => setSelectedOption(method.value)}
                    />
                    <img
                      src={method.icon}
                      alt={method.label}
                      className="pg-icon"
                    />
                    <span className="pg-label">{method.label}</span>
                  </label>
                ))}
              </div>

              {selectedOption && (
                <div className="pg-method-details">
                  {selectedOption === "paypal" && (
                    <p>
                      You selected <strong>PayPal</strong>. You’ll be redirected
                      to PayPal to complete the payment.
                    </p>
                  )}
                  {selectedOption === "creditcard" && (
                    <form className="pg-credit-form">
                      <input type="text" placeholder="Card Number" required />
                      <input
                        type="text"
                        placeholder="Expiry Date (MM/YY)"
                        required
                      />
                      <input type="text" placeholder="CVV" required />
                    </form>
                  )}
                  {selectedOption === "netbanking" && (
                    <p>
                      You selected <strong>Net Banking</strong>. Please choose
                      your bank on the next step.
                    </p>
                  )}
                  {selectedOption === "cod" && (
                    <p>
                      You selected <strong>Cash on Delivery</strong>. Please
                      keep the exact amount ready.
                    </p>
                  )}
                </div>
              )}

              <div className="pg-nav-btns">
                <button
                  className="pay-btn"
                  onClick={() => setStep(2)}
                  style={{ marginRight: "16px" }}
                >
                  Back
                </button>
                <button className="pay-btn" onClick={handlePayment}>
                  Pay Now
                </button>
              </div>
            </div>
          )}
          {step === 4 && (
            <div className="pg-section pg-success">
              <h2 className="pg-title">🎉 Order Successful!</h2>
              <p>
                Thank you <strong>{address.name}</strong>! <br />
                Your order has been placed successfully.
              </p>
              <p>
                Payment Method: <strong>{selectedOption}</strong>
              </p>
              <p>Total Paid: ₹{orderSummary.total}</p>
              <button className="pay-btn" onClick={() => setStep(1)}>
                Place Another Order
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentGateway;
