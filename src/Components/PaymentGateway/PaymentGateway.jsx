import React, { useState, useEffect, useContext } from "react";
import "./PaymentGateway.css";
import { ShopContext } from "../../Context/ShopContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

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
  const { getCartDetails, getTotalCartAmount, currentUser } =
    useContext(ShopContext);
  const [selectedOption, setSelectedOption] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const [address, setAddress] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [addressSaved, setAddressSaved] = useState(false);
  const [orderTotal, setOrderTotal] = useState(0);
  const [items, setItems] = useState([]);

  // Load cart items
  useEffect(() => {
    const cartItems = getCartDetails();
    setItems(cartItems);
    setOrderTotal(getTotalCartAmount());
  }, [getCartDetails, getTotalCartAmount]);

  const handlePayment = async () => {
    if (!selectedOption) {
      toast.error("⚠️ Please select a payment option.");
      return;
    }

    toast.info("Processing payment...");

    setTimeout(async () => {
      try {
        const orders = items.map((item) => ({
          userId: currentUser?.id || "guest",
          name: address.name,
          email: currentUser?.email || address.email || "guest@example.com",
          mobile: address.phone,
          address: `${address.address}, ${address.city}, ${address.state} - ${address.pincode}`,
          productId: item.id,
          productName: item.name,
          image: item.image,
          quantity: item.qty,
          price: item.price,
          date: new Date().toISOString(),
          status: "Completed",
        }));

        await Promise.all(
          orders.map((order) =>
            fetch("http://localhost:5000/purchases", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(order),
            })
          )
        );

        toast.success("🎉 Payment Successful! Order placed.");
        setStep(4);

        if (onSuccess)
          onSuccess({
            paymentId: "demo123",
            amount: orderTotal,
            method: selectedOption,
          });
      } catch (err) {
        console.error(err);
        toast.error("❌ Failed to place order.");
      }
    }, 1500);
  };

  return (
    <div className="pg-amazon-bg">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
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
                    toast.success("✅ Address saved successfully!");
                  }}
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={address.name}
                    onChange={(e) =>
                      setAddress({ ...address, name: e.target.value })
                    }
                  />

                  {!currentUser && (
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={address.email}
                      onChange={(e) =>
                        setAddress({ ...address, email: e.target.value })
                      }
                    />
                  )}

                  <input
                    type="text"
                    placeholder="Phone Number"
                    required
                    value={address.phone}
                    onChange={(e) =>
                      setAddress({ ...address, phone: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Address Line"
                    required
                    value={address.address}
                    onChange={(e) =>
                      setAddress({ ...address, address: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="City"
                    required
                    value={address.city}
                    onChange={(e) =>
                      setAddress({ ...address, city: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="State"
                    required
                    value={address.state}
                    onChange={(e) =>
                      setAddress({ ...address, state: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    required
                    value={address.pincode}
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
                        toast.info("✏️ Edit mode enabled.");
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
                {items.map((item) => (
                  <div key={item.id} className="pg-order-item">
                    <span>
                      {item.name} (x{item.qty})
                    </span>
                    <span>${item.price * item.qty}</span>
                  </div>
                ))}
                <div className="pg-order-total">
                  <strong>Total:</strong> <strong>${orderTotal}</strong>
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

              <div className="pg-payment-details">
                {selectedOption === "paypal" && (
                  <div className="pg-paypal">
                    <h3>Pay via PayPal</h3>
                    <p>You will be redirected to PayPal to complete payment.</p>
                  </div>
                )}
                {selectedOption === "creditcard" && (
                  <div className="pg-credit">
                    <h3>Enter Credit Card Details</h3>
                    <input type="text" placeholder="Card Number" required />
                    <input
                      type="text"
                      placeholder="Card Holder Name"
                      required
                    />
                    <input type="text" placeholder="MM/YY" required />
                    <input type="password" placeholder="CVV" required />
                  </div>
                )}
                {selectedOption === "netbanking" && (
                  <div className="pg-netbanking">
                    <h3>Select Your Bank</h3>
                    <select>
                      <option value="">--Choose Bank--</option>
                      <option value="sbi">SBI</option>
                      <option value="hdfc">HDFC</option>
                      <option value="icici">ICICI</option>
                      <option value="axis">Axis</option>
                    </select>
                  </div>
                )}
                {selectedOption === "cod" && (
                  <div className="pg-cod">
                    <h3>Cash on Delivery</h3>
                    <p>Pay cash on delivery.</p>
                  </div>
                )}
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
                  navigate("/");
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
