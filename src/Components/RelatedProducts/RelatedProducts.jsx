import React, { useContext } from "react";
import "./RelatedProducts.css";
import Item from "./../Items/Item";
import { ShopContext } from "../../Context/ShopContext";
import { getProductImage } from "../../utils/imageLoader";

const RelatedProducts = () => {
  const { allProducts } = useContext(ShopContext);

  // Get a sample of related products (first 4)
  const relatedItems = allProducts.slice(0, 4);

  return (
    <div className="relatedproducts">
      <h1>Related Products</h1>
      <hr />
      <div className="relatedproducts-item">
        {relatedItems.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            image={getProductImage(item.id)}
            name={item.name}
            new_price={item.price}
            old_price={item.offerPrice}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
