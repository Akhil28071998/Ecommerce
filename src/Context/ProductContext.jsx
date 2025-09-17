import axios from "axios";
import { createContext, useEffect, useState } from "react";

const ProductContext = createContext(null);

const ProductProvider = ({ children }) => {
  const [allproduct, setAllProduct] = useState([]);

  useEffect(() => {
    getProduct();
  }, []);
  const getProduct = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setAllProduct(res.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };
 

  const value = { allproduct };

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
};

export { ProductContext, ProductProvider };
