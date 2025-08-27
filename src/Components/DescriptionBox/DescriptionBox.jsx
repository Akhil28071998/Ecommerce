import React from "react";
import "./DescriptionBox.css";

const DescriptionBox = () => {
  return (
    <div className="descriptionBox">
      <div className="descriptionBox-navigator">
        <div className="descriptionBox-nav-box">Description</div>
        <div className="descriptionBox-nav-box fade">Review (122)</div>
      </div>
      <div className="descriptionBox-description">
        <p>
          An e-commerce website is a platform that facilitates buying and
          selling of products or services over the internet, serving as a
          virtual marketplace where businesses and individuals showcase their
          products, interact with customers, and conduct transactions without
          the need for a physical presence. E-commerce websites have gained
          immense popularity due to their convenience, accessibility, and the
          global reach they offer.
        </p>
        <p>
          E-commerce websites typically provide products or services with
          detailed descriptions, images, prices, and any available variations
          (e.g., sizes, colors). Each product usually has its own detail page
          with relevant information.
        </p>
      </div>
    </div>
  );
};

export default DescriptionBox;
