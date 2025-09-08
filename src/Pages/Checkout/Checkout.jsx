import React, { useContext } from "react";
import { ShopContext } from "../Context/ShopContext";
import PaymentGateway from "../Components/PaymentGateway/PaymentGateway";

const Checkout = () => {
  const { all_product, cartItems } = useContext(ShopContext);

  const items = all_product
    .filter((item) => cartItems[item.id] > 0)
    .map((item) => ({
      name: item.name,
      price: item.new_price,
      qty: cartItems[item.id],
    }));

  return <PaymentGateway items={items} />;
};

export default Checkout;
