import React, { useContext } from "react";
import "./NewCollections.css";
import Item from "../Items/Item";
import { ShopContext } from "../../Context/ShopContext";
import { getProductImage } from "../../utils/imageLoader";

const NewCollections = () => {
  const { allProducts } = useContext(ShopContext);

  // Get last 8 products for new collections
  const newItems = allProducts.slice(-8);

  return (
    <div className="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {newItems.map((item, i) => {
          return (
            <Item
              key={item.id}
              image={getProductImage(item.id)}
              name={item.name}
              new_price={item.price}
              old_price={item.offerPrice}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NewCollections;
