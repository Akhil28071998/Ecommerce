import React, { useContext } from "react";
import "./popular.css";
import PopularItem from "./PopularItem";
import { ShopContext } from "../../Context/ShopContext";
import { getProductImage } from "../../utils/imageLoader";

const Popular = () => {
  const { allProducts } = useContext(ShopContext);

  // Filter women's products and get first 4
  const popularItems = allProducts
    .filter((item) => item.category === "women")
    .slice(0, 4);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN </h1>
      <hr />
      <div className="popular-item">
        {popularItems.map((item, i) => {
          return (
            <PopularItem
              key={i}
              image={getProductImage(item.id)}
              name={item.name}
              price={item.price}
              old_price={item.offerPrice}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
