import React from "react";
import { Link } from "react-router-dom";
import "./Item.css";

const Item = ({ id, image, name, new_price, old_price }) => {
  // discount calculate
  const discount =
    old_price > new_price
      ? Math.round(((old_price - new_price) / old_price) * 100)
      : 0;

  return (
    <div className="item">
      <Link to={`/product/${id}`} onClick={() => window.scrollTo(0, 0)}>
        <img src={image} alt={name} />
      </Link>
      <p>{name}</p>
      <div className="item-prices">
        <div className="item-price-new">${old_price}</div>
        <div className="item-price-old">${new_price}</div>
        {/* {discount > 0 && <div className="item-discount">-{discount}</div>} */}
      </div>
    </div>
  );
};

export default Item;
