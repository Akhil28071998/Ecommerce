import React, { createContext, useState, useEffect, useContext } from "react";
import all_product from "../assets/Assets/all_product";
import { AuthContext } from "./AuthContext"; // import AuthContext

export const ShopContext = createContext();

const getDefaultCart = () => {
  let cart = {};
  all_product.forEach((p) => (cart[p.id] = 0));
  return cart;
};

const ShopProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext); // get logged-in user
  const [cartItems, setCartItems] = useState(getDefaultCart());

  // ✅ Load cart when user logs in, reset on logout
  useEffect(() => {
    if (!currentUser) {
      setCartItems(getDefaultCart()); // reset cart when user logs out
      return;
    }

    const fetchCart = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/cart?userId=${currentUser.id}`
        );
        const data = await res.json();

        let newCart = getDefaultCart();
        data.forEach((item) => {
          newCart[item.productId] = item.quantity;
        });

        setCartItems(newCart);
      } catch (error) {
        console.error("Failed to fetch cart:", error);
      }
    };

    fetchCart();
  }, [currentUser]);

  // ✅ Add to cart
  const addToCart = async (itemId) => {
    if (!currentUser) return; // only logged-in users

    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));

    try {
      const res = await fetch(
        `http://localhost:5000/cart?userId=${currentUser.id}&productId=${itemId}`
      );
      const data = await res.json();

      if (data.length > 0) {
        // update existing
        const cartItem = data[0];
        await fetch(`http://localhost:5000/cart/${cartItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: cartItem.quantity + 1 }),
        });
      } else {
        // add new
        await fetch("http://localhost:5000/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            productId: itemId,
            quantity: 1,
          }),
        });
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  // ✅ Remove one quantity
  const removeFromCart = async (itemId) => {
    if (!currentUser) return;

    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max(prev[itemId] - 1, 0),
    }));

    try {
      const res = await fetch(
        `http://localhost:5000/cart?userId=${currentUser.id}&productId=${itemId}`
      );
      const data = await res.json();

      if (data.length > 0) {
        const cartItem = data[0];
        const newQty = Math.max(cartItem.quantity - 1, 0);

        if (newQty === 0) {
          await fetch(`http://localhost:5000/cart/${cartItem.id}`, {
            method: "DELETE",
          });
        } else {
          await fetch(`http://localhost:5000/cart/${cartItem.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quantity: newQty }),
          });
        }
      }
    } catch (error) {
      console.error("Failed to remove from cart:", error);
    }
  };

  // ✅ Delete item completely
  const deleteFromCart = async (itemId) => {
    if (!currentUser) return;

    setCartItems((prev) => ({ ...prev, [itemId]: 0 }));

    try {
      const res = await fetch(
        `http://localhost:5000/cart?userId=${currentUser.id}&productId=${itemId}`
      );
      const data = await res.json();

      if (data.length > 0) {
        await fetch(`http://localhost:5000/cart/${data[0].id}`, {
          method: "DELETE",
        });
      }
    } catch (error) {
      console.error("Failed to delete from cart:", error);
    }
  };

  // ✅ Place Order Function
  const placeOrder = async () => {
    if (!currentUser) return;

    try {
      // Get cart data of this user
      const res = await fetch(
        `http://localhost:5000/cart?userId=${currentUser.id}`
      );
      const cartData = await res.json();

      for (let item of cartData) {
        const product = all_product.find((p) => p.id === item.productId);

        if (product) {
          // Save purchase with user info + product info
          await fetch("http://localhost:5000/purchases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: currentUser.id,
              name: currentUser.name,
              email: currentUser.email,
              // ❌ don't save password ideally
              productId: product.id,
              productName: product.name,
              image: product.image,
              quantity: item.quantity,
              price: product.new_price * item.quantity,
              date: new Date().toISOString(),
            }),
          })
          .then(res => {
            console.log(res,'kgjhasgdagh')
          })
        }

        // Remove product from cart after purchase
        await fetch(`http://localhost:5000/cart/${item.id}`, {
          method: "DELETE",
        });
      }

      setCartItems(getDefaultCart()); // clear cart in frontend
      alert("✅ Purchase saved successfully!");
    } catch (error) {
      console.error("Failed to save purchase:", error);
    }
  };

  // ✅ Get total cart amount
  const getTotalCartAmount = () =>
    Object.keys(cartItems).reduce((total, id) => {
      const product = all_product.find((p) => p.id === Number(id));
      return total + (product ? product.new_price * cartItems[id] : 0);
    }, 0);

  // ✅ Get total items count
  const getTotalCartItems = () =>
    Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  // ✅ Get detailed cart items
  const getCartDetails = () =>
    all_product
      .filter((p) => cartItems[p.id] > 0)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.new_price,
        qty: cartItems[p.id],
        image: p.image,
      }));

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
        getCartDetails,
        placeOrder, // ✅ added here
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;
