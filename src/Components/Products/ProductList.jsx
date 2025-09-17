import React, { useContext, useEffect } from "react";
import ProductDisplay from "../ProductDisplay/ProductDisplay";
import { ProductContext } from "../../Context/ProductContext";

const ProductList = () => {
  const { allproduct } = useContext(ProductContext);

  return (
    <div className="product-list">
      {allproduct && allproduct.length ? (
        allproduct.map((p) => <ProductDisplay key={p.id} product={p} />)
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
};

export default ProductList;
