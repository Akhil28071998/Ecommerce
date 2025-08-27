import React, { createContext, useState } from "react";
import all_product from "../assets/Assets/all_product";

export const ShopContext = createContext(null);

const ShopProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addTOCart = (product) => {
    setCartItems((prevCartItems) => {
      const existing = prevCartItems.find((item) => item.id === product.id);
      if (existing) {
        return prevCartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCartItems, { ...product, quantity: 1 }];
    });
  };

  return (
    <ShopContext.Provider value={{ all_product, cartItems, addTOCart }}>
      {children}
    </ShopContext.Provider>
  );
};
export default ShopProvider;







// import React, { createContext, useState } from "react";
// import all_product from "../assets/Assets/all_product";

// export const ShopContext = createContext(null);

// const ShopContextProvider = (props) => {
//   const [cartItems, setCartItems] = useState(getDefaultCart());
//   console.log(cartItems);
//   const contextValue = { all_product };

//   const getDefaultCart = () => {
//     let cart = {};
//     for (let index = 0; index < all_product.length; index++) {
//       cart[index] = 0;
//     }
//   };

//   return (
//     <ShopContext.Provider value={contextValue}>
//       {props.children}
//     </ShopContext.Provider>
//   );
// };

// export default ShopContextProvider;
