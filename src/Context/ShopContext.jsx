import React, { createContext, useState } from "react";
import all_product from "../assets/Assets/all_product";

export const ShopContext = createContext(null);

const getDefaultCart = () => {
  let cart = {};
  for (let i = 0; i < all_product.length; i++) {
    cart[all_product[i].id] = 0;
  }
  return cart;
};

const ShopProvider = (props) => {
  const [cartItems, setCartItems] = useState(getDefaultCart());

  const addToCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      if (prev[itemId] > 1) {
        return { ...prev, [itemId]: prev[itemId] - 1 };
      } else {
        return { ...prev, [itemId]: 0 };
      }
    });
  };

  const getTotalCartAmount = () => {
    let totalAmout = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find(
          (product) => product.id === Number(item)
        );
        totalAmout += itemInfo.new_price * cartItems[item];
      }
    }
    return totalAmout;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const deleteFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: 0 }));
  };

  return (
    <ShopContext.Provider
      value={{
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        deleteFromCart,
        getTotalCartAmount,
        getTotalCartItems,
      }}
    >
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;
