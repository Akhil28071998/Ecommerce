import React from "react";
import "./Breadcrums.css";
import { IoIosArrowForward } from "react-icons/io";

const Breadcrums = ({ product }) => {
  if (!product) {
    return null; // or a loader/spinner
  }

  return (
    <div className="breadcrumb-container">
      <div className="breadcrumb">
        <span>HOME</span> <IoIosArrowForward />
        <span>SHOP</span> <IoIosArrowForward />
        <span>{product.category || "Category"}</span> <IoIosArrowForward />
        <span>{product.name || "Product"}</span>
      </div>
      <div className="product-tags">
        {product.tags && product.tags.length > 0 ? (
          product.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))
        ) : (
          <span className="tag">No tags</span>
        )}
      </div>
    </div>
  );
};

export default Breadcrums;
