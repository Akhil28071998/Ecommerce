import React from "react";

const PopularItem = ({ image, name, price, old_price }) => {
  return (
    <div className="popular-item-card">
      <img src={image} alt={name} className="popular-item-img" />
      <h3 className="popular-item-name">{name}</h3>
      <div className="popular-item-prices">
        <span className="popular-item-price">${price}</span>
        {old_price && (
          <span
            className="popular-item-old-price"
            style={{ textDecoration: "line-through" }}
          >
            ${old_price}
          </span>
        )}
      </div>
    </div>
  );
};

export default PopularItem;
