import React from "react";
import "./popular.css";
import data_product from "../../assets/Assets/data";
import PopularItem from "./PopularItem";

const Popular = () => {
  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN </h1>
      <hr />
      <div className="popular-item">
        {data_product.map((item, i) => {
          return (
            <PopularItem
              key={i}
              image={item.image}
              name={item.name}
              price={item.new_price}
              old_price={item.old_price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
