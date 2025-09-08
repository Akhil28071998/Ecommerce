import React, { useState, useEffect, useContext } from "react";
import "./PaymentGateway.css";
import { ShopContext } from "../../Context/ShopContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const PaymentGateway = ({ onSuccess }) => {
  const { getCartDetails, getTotalCartAmount } = useContext(ShopContext);

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
  const [orderTotal, setOrderTotal] = useState(0);
  const [items, setItems] = useState([]);

  // ✅ Load items from cart context
  useEffect(() => {
    const cartItems = getCartDetails();
    setItems(cartItems);
    setOrderTotal(getTotalCartAmount());
  }, [getCartDetails, getTotalCartAmount]);

  const handlePayment = () => {
    if (!selectedOption) {
      toast.error("⚠️ Please select a payment option.");
      return;
    }

    toast.info("Processing payment...");

    setTimeout(() => {
      setStep(4);
      toast.success("🎉 Payment Successful! Order placed.");

      if (onSuccess) {
        onSuccess({
          paymentId: "demo123",
          amount: orderTotal,
          method: selectedOption,
        });
      }
    }, 1500);
  };

  return (
    <div className="pg-amazon-bg">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <div className="pg-amazon-container">
        {/* Sidebar Steps */}
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

        {/* Main Steps */}
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
                    toast.success("✅ Address saved successfully!");
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
                      onClick={() => {
                        setAddressSaved(false);
                        toast.info("✏️ Address edit mode enabled.");
                      }}
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Step 2: Order Summary */}
          {step === 2 && (
            <div className="pg-section">
              <h2 className="pg-title">Order Summary</h2>
              <div className="pg-order-card">
                {items.length > 0 ? (
                  items.map((item) => (
                    <div key={item.id} className="pg-order-item">
                      <span>
                        {item.name} (x{item.qty})
                      </span>
                      <span>${item.price * item.qty}</span>
                    </div>
                  ))
                ) : (
                  <div>No items in the order.</div>
                )}
                <div className="pg-order-total">
                  <strong>Total:</strong>
                  <strong>${orderTotal}</strong>
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
                <button
                  className="pay-btn"
                  onClick={() => {
                    setStep(3);
                    toast.info("Proceeding to payment...");
                  }}
                >
                  Proceed to Payment
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
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

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="pg-section pg-success">
              <h2 className="pg-title">🎉 Order Successful!</h2>
              <p>
                Thank you <strong>{address.name}</strong>! Your order has been
                placed successfully.
              </p>
              <p>
                Payment Method: <strong>{selectedOption}</strong>
              </p>
              <p>Total Paid: ${orderTotal}</p>
              <button
                className="pay-btn"
                onClick={() => {
                  setStep(1);
                  toast.info("You can place another order now.");
                }}
              >
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
