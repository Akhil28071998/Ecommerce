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
  const [allProducts, setAllProducts] = useState([]);
  const [coupon, setCoupon] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!currentUser) {
        const savedCart =
          JSON.parse(localStorage.getItem("guestCart")) || getDefaultCart();
        const savedWishlist =
          JSON.parse(localStorage.getItem("guestWishlist")) || [];
        setCartItems(savedCart);
        setWishlist(savedWishlist);
        return;
      }

      try {
        const resCart = await fetch(
          `http://localhost:5000/cart?userId=${currentUser.id}`
        );
        const cartData = await resCart.json();
        let newCart = getDefaultCart();
        cartData.forEach((item) => {
          if (item.productId != null) newCart[item.productId] = item.quantity;
        });
        setCartItems(newCart);

        const resWish = await fetch(
          `http://localhost:5000/wishlist?userId=${currentUser.id}`
        );
        const wishlistData = await resWish.json();
        setWishlist(wishlistData.map((w) => w.productId));
      } catch (err) {
        console.error("Failed to fetch cart/wishlist:", err);
      }
    };

    loadData();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem("guestCart", JSON.stringify(cartItems));
      localStorage.setItem("guestWishlist", JSON.stringify(wishlist));
    }
  }, [cartItems, wishlist, currentUser]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/products");
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = async (itemId, qty = 1) => {
    if (!itemId) return console.error("Invalid productId");

    if (!currentUser) {
      alert("⚠️ Please login first to add items to the cart!");
      return;
    }

    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + qty }));

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
            id: Date.now().toString() + Math.random(),
            userId: currentUser.id,
            productId: itemId,
            quantity: qty,
          }),
        });
      }
    } catch (err) {
      console.error("Failed to add to cart:", err);
    }
  };

  const removeFromCart = async (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: Math.max(prev[itemId] - 1, 0),
    }));

    if (!currentUser) return;

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
    } catch (err) {
      console.error("Failed to remove from cart:", err);
    }
  };

  const deleteFromCart = async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: 0 }));

    if (!currentUser) return;

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
    } catch (err) {
      console.error("Failed to delete from cart:", err);
    }
  };

  const clearCart = async () => {
    setCartItems(getDefaultCart());
    if (!currentUser) return;

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
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };

  const toggleWishlist = async (itemId) => {
    if (!currentUser) {
      alert("⚠️ Please login first to add items to the wishlist!");
      return;
    }

    if (wishlist.includes(itemId)) {
      setWishlist((prev) => prev.filter((id) => id !== itemId));
      try {
        const res = await fetch(
          `http://localhost:5000/wishlist?userId=${currentUser.id}&productId=${itemId}`
        );
        const data = await res.json();
        if (data.length > 0)
          await fetch(`http://localhost:5000/wishlist/${data[0].id}`, {
            method: "DELETE",
          });
      } catch (err) {
        console.error("Failed to remove from wishlist:", err);
      }
    } else {
      setWishlist((prev) => [...prev, itemId]);
      try {
        await fetch("http://localhost:5000/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: currentUser.id, productId: itemId }),
        });
      } catch (err) {
        console.error("Failed to add to wishlist:", err);
      }
    }
  };

  const applyCoupon = (code) => {
    const coupons = { SAVE10: 0.1, SAVE20: 0.2, FLAT50: 50 };
    if (coupons[code]) {
      setCoupon(code);
      alert(`Coupon applied: ${code}`);
    } else {
      setCoupon(null);
      alert("Invalid coupon code!");
    }
  };

  const placeOrder = async () => {
    if (!currentUser) return alert("Please login to place an order!");
    try {
      const res = await fetch(
        `http://localhost:5000/cart?userId=${currentUser.id}`
      );
      const cartData = await res.json();

      for (let item of cartData) {
        const source = allProducts.length > 0 ? allProducts : all_product;
        const product = source.find(
          (p) => String(p.id) === String(item.productId)
        );
        if (!product) continue;

        const offerPrice =
          product.new_price ?? product.offerPrice ?? product.price ?? 0;

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
            price: offerPrice * item.quantity,
            date: new Date().toISOString(),
            status: "Pending",
          }),
        });

        await fetch(`http://localhost:5000/cart/${item.id}`, {
          method: "DELETE",
        });
      }

      setCartItems(getDefaultCart());
      alert("✅ Purchase saved successfully!");
    } catch (err) {
      console.error("Failed to place order:", err);
    }
  };

  // ✅ FIX: getTotalCartAmount
  const getTotalCartAmount = () => {
    const source = allProducts.length > 0 ? allProducts : all_product;

    let total = Object.keys(cartItems).reduce((sum, id) => {
      const product = source.find((p) => String(p.id) === String(id));
      if (!product) return sum;

      const offerPrice = product.price;
      return sum + offerPrice * cartItems[id];
    }, 0);

    if (coupon === "SAVE10") return total * 0.9;
    if (coupon === "SAVE20") return total * 0.8;
    if (coupon === "FLAT50") return Math.max(total - 50, 0);
    return total;
  };

  const getTotalCartItems = () =>
    Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);

  // ✅ FIX: getCartDetails
  const getCartDetails = () => {
    const source = allProducts.length > 0 ? allProducts : all_product;

    return source
      .filter((p) => cartItems[p.id] > 0)
      .map((p) => {
        const offerPrice = p.new_price ?? p.offerPrice ?? p.price ?? 0;
        return {
          id: p.id,
          name: p.name,
          price: offerPrice,
          oldPrice: p.price,
          qty: cartItems[p.id],
          image: p.image,
        };
      });
  };

  return (
    <ShopContext.Provider
      value={{
        all_product,
        allProducts,
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
