import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import { AuthContext } from "../Context/AuthContext"; // for current user
import PaymentGateway from "../Components/PaymentGateway/PaymentGateway";

const Checkout = () => {
  const { all_product, cartItems } = useContext(ShopContext);
  const { currentUser } = useContext(AuthContext); // logged in user

  // selected items from cart
  const items = all_product
    .filter((item) => cartItems[item.id] > 0)
    .map((item) => ({
      id: item.id,
      name: item.name,
      price: item.new_price,
      qty: cartItems[item.id],
      image: item.image,
    }));

  // purchase save function
  const savePurchases = async () => {
    if (!currentUser) {
      alert("Please login before placing order");
      return;
    }

    try {
      for (const product of items) {
        const newPurchase = {
          id: Date.now() + Math.random(), // unique id
          userId: currentUser.id, // must match users table id
          productName: product.name,
          quantity: product.qty,
          price: product.price,
          image: product.image,
          date: new Date().toISOString(),
          status: "Pending",
        };

        await fetch("http://localhost:5000/purchases", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newPurchase),
        });
      }
      alert("✅ Order placed successfully!");
    } catch (err) {
      console.error("Error saving purchase:", err);
      alert("❌ Failed to save order!");
    }
  };

  return (
    <div>
      <PaymentGateway items={items} onSuccess={savePurchases} />
    </div>
  );
};

export default Checkout;
