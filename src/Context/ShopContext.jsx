// src/Context/ShopContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import all_product from "../assets/Assets/all_product";
import { AuthContext } from "./AuthContext";

export const ShopContext = createContext();

const getDefaultCart = () => {
  let cart = {};
  all_product.forEach((p) => (cart[p.id] = 0));
  return cart;
};

const ShopProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);

  const [cartItems, setCartItems] = useState(getDefaultCart());
  const [wishlist, setWishlist] = useState([]);
  const [coupon, setCoupon] = useState(null);

  // ✅ Load cart & wishlist from DB if logged in, else from localStorage
  useEffect(() => {
    if (!currentUser) {
      // Guest user → load from localStorage
      const savedCart =
        JSON.parse(localStorage.getItem("guestCart")) || getDefaultCart();
      const savedWishlist =
        JSON.parse(localStorage.getItem("guestWishlist")) || [];
      setCartItems(savedCart);
      setWishlist(savedWishlist);
      return;
    }

    // Logged-in user → load from backend
    const fetchCartAndWishlist = async () => {
      try {
        // Load Cart
        const resCart = await fetch(
          `http://localhost:5000/cart?userId=${currentUser.id}`
        );
        const cartData = await resCart.json();

        let newCart = getDefaultCart();
        cartData.forEach((item) => {
          newCart[item.productId] = item.quantity;
        });
        setCartItems(newCart);

        // Load Wishlist
        const resWish = await fetch(
          `http://localhost:5000/wishlist?userId=${currentUser.id}`
        );
        const wishlistData = await resWish.json();
        setWishlist(wishlistData.map((w) => w.productId));
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchCartAndWishlist();
  }, [currentUser]);

  // ✅ Persist guest cart/wishlist to localStorage
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem("guestCart", JSON.stringify(cartItems));
      localStorage.setItem("guestWishlist", JSON.stringify(wishlist));
    }
  }, [cartItems, wishlist, currentUser]);

  // ✅ Add to cart
  const addToCart = async (itemId, qty = 1) => {
    if (!currentUser) {
      // Guest → update local state only
      setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + qty }));
      return;
    }

    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + qty }));

    try {
      const res = await fetch(
        `http://localhost:5000/cart?userId=${currentUser.id}&productId=${itemId}`
      );
      const data = await res.json();

      if (data.length > 0) {
        const cartItem = data[0];
        await fetch(`http://localhost:5000/cart/${cartItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity: cartItem.quantity + qty }),
        });
      } else {
        await fetch("http://localhost:5000/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            productId: itemId,
            quantity: qty,
          }),
        });
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  // ✅ Remove one quantity
  const removeFromCart = async (itemId) => {
    if (!currentUser) {
      setCartItems((prev) => ({
        ...prev,
        [itemId]: Math.max(prev[itemId] - 1, 0),
      }));
      return;
    }

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
    if (!currentUser) {
      setCartItems((prev) => ({ ...prev, [itemId]: 0 }));
      return;
    }

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

  // ✅ Clear entire cart
  const clearCart = async () => {
    if (!currentUser) {
      setCartItems(getDefaultCart());
      return;
    }

    setCartItems(getDefaultCart());

    try {
      const res = await fetch(
        `http://localhost:5000/cart?userId=${currentUser.id}`
      );
      const data = await res.json();

      for (let item of data) {
        await fetch(`http://localhost:5000/cart/${item.id}`, {
          method: "DELETE",
        });
      }
    } catch (error) {
      console.error("Failed to clear cart:", error);
    }
  };

  // ✅ Wishlist functions
  const toggleWishlist = async (itemId) => {
    if (!currentUser) {
      setWishlist((prev) =>
        prev.includes(itemId)
          ? prev.filter((id) => id !== itemId)
          : [...prev, itemId]
      );
      return;
    }

    if (wishlist.includes(itemId)) {
      // remove
      setWishlist((prev) => prev.filter((id) => id !== itemId));
      try {
        const res = await fetch(
          `http://localhost:5000/wishlist?userId=${currentUser.id}&productId=${itemId}`
        );
        const data = await res.json();
        if (data.length > 0) {
          await fetch(`http://localhost:5000/wishlist/${data[0].id}`, {
            method: "DELETE",
          });
        }
      } catch (error) {
        console.error("Failed to remove from wishlist:", error);
      }
    } else {
      // add
      setWishlist((prev) => [...prev, itemId]);
      try {
        await fetch("http://localhost:5000/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser.id,
            productId: itemId,
          }),
        });
      } catch (error) {
        console.error("Failed to add to wishlist:", error);
      }
    }
  };

  // ✅ Apply Coupon
  const applyCoupon = (code) => {
    const coupons = {
      SAVE10: 0.1,
      SAVE20: 0.2,
      FLAT50: 50,
    };

    if (coupons[code]) {
      setCoupon(code);
      alert(`Coupon applied: ${code}`);
    } else {
      setCoupon(null);
      alert("Invalid coupon code!");
    }
  };

  // ✅ Place Order (same as before)
  const placeOrder = async () => {
    if (!currentUser) {
      alert("Please login to place an order!");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/cart?userId=${currentUser.id}`
      );
      const cartData = await res.json();

      for (let item of cartData) {
        const product = all_product.find((p) => p.id === item.productId);
        if (product) {
          await fetch("http://localhost:5000/purchases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: currentUser.id,
              name: currentUser.name,
              email: currentUser.email,
              productId: product.id,
              productName: product.name,
              image: product.image,
              quantity: item.quantity,
              price: product.new_price * item.quantity,
              date: new Date().toISOString(),
              status: "Pending",
            }),
          });
        }
        await fetch(`http://localhost:5000/cart/${item.id}`, {
          method: "DELETE",
        });
      }

      setCartItems(getDefaultCart());
      alert("✅ Purchase saved successfully!");
    } catch (error) {
      console.error("Failed to save purchase:", error);
    }
  };

  // ✅ Get total cart amount with coupon applied
  const getTotalCartAmount = () => {
    let total = Object.keys(cartItems).reduce((sum, id) => {
      const product = all_product.find((p) => p.id === Number(id));
      return sum + (product ? product.new_price * cartItems[id] : 0);
    }, 0);

    if (coupon === "SAVE10") return total * 0.9;
    if (coupon === "SAVE20") return total * 0.8;
    if (coupon === "FLAT50") return Math.max(total - 50, 0);
    return total;
  };

  const getTotalCartItems = () =>
    Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

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
        wishlist,
        coupon,
        addToCart,
        removeFromCart,
        deleteFromCart,
        clearCart,
        toggleWishlist,
        applyCoupon,
        getTotalCartAmount,
        getTotalCartItems,
        getCartDetails,
        placeOrder,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;
