import React, { useContext, useState, useEffect } from "react";
import "./ProductDisplay.css";
import star_icon from "../../assets/Assets/star_icon.png";
import star_dull_icon from "../../assets/Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";

const ProductDisplay = ({ product }) => {
  const { addTOCart } = useContext(ShopContext);

  const [mainImage, setMainImage] = useState(product?.image || "");
  const [lensPos, setLensPos] = useState({ x: "50%", y: "50%" });

  useEffect(() => {
    if (product?.image) {
      setMainImage(product.image);
    }
  }, [product]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x: `${x}%`, y: `${y}%` });
  };

  if (!product) {
    return <div className="productdisplay">Loading product...</div>;
  }

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {[product.image, product.image, product.image, product.image].map(
            (img, index) => (
              <img
                key={index}
                src={img}
                alt={product.name}
                onClick={() => setMainImage(img)}
                className={mainImage === img ? "active-thumbnail" : ""}
              />
            )
          )}
        </div>

        <div
          className="productdisplay-main-img"
          onMouseMove={handleMouseMove}
          style={{
            "--x": lensPos.x,
            "--y": lensPos.y,
          }}
        >
          <img src={mainImage} alt={product.name} />
        </div>
      </div>

      <div className="productdisplay-right">
        <h1>{product.name || "Unnamed Product"}</h1>

        <div className="product-display-star">
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_icon} alt="star" />
          <img src={star_dull_icon} alt="empty star" />
          <p>(122)</p>
        </div>

        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-prices-old">
            ${product.old_price || "0.00"}
          </div>
          <div className="productdisplay-right-prices-new">
            ${product.new_price || "0.00"}
          </div>
        </div>

        <div className="productdisplay-right-display">
          {product.description ||
            "A lightweight, usually knitted, pullover shirt, close-fitting and with a round neckline and short sleeves."}
        </div>

        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
        </div>
        <div className="productdisplay-right-size">
          <div tabIndex={0}>S</div>
          <div tabIndex={0}>M</div>
          <div tabIndex={0}>L</div>
          <div tabIndex={0}>XL</div>
          <div tabIndex={0}>XXL</div>
        </div>

        <button onClick={() => addTOCart(product.id)}>ADD TO CART</button>

        <p className="productdisplay-right-category">
          <span>Category :</span> {product.category || "General"}
        </p>
        <p className="productdisplay-right-category">
          <span>Tags:</span>{" "}
          {product.tags?.length ? product.tags.join(", ") : "None"}
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
