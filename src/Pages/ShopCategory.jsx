import React, { useEffect, useState } from "react";
import "./Css/ShopCategory.css";
import dropdown_icon from "../assets/Assets/dropdown_icon.png";
import Item from "../Components/Items/Item.jsx";
import axios from "axios";

const ShopCategory = (props) => {
  const [items, setItems] = useState([]);

  // API call
  useEffect(() => {
    getProduct();
  }, []); // run only once

  const getProduct = async () => {
    try {
      const res = await axios.get("http://localhost:5000/products");
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  console.log("====================================");
  console.log(items);
  console.log("====================================");

  return (
    <div className="shop-category">
      <img src={props.banner} alt="" />

      <div className="shopcategory-indexSort">
        <p>
          <span>Showing 1-12 </span> out of {items.length} products
        </p>
        <div className="shopcategory-sort">
          sort by <img src={dropdown_icon} alt="" />
        </div>
      </div>

      <div className="shopcategory-products">
        {items?.map((item, i) => {
          if (props.category === item.category) {
            return (
              <Item
                key={i}
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.offerPrice} // discounted price
                old_price={item.price} // original price
              />
            );
          } else {
            return null;
          }
        })}
      </div>
      <div className="shopcategory-loadmore">Explore More</div>
    </div>
  );
};

export default ShopCategory;
