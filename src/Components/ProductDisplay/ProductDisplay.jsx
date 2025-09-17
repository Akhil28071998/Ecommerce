import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./ProductDisplay.css";
import star_icon from "../../assets/Assets/star_icon.png";
import star_dull_icon from "../../assets/Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { ProductContext } from "../../Context/ProductContext";

const ProductDisplay = (props) => {
  const { productId } = useParams(); // Get product ID from URL
  const { product } = props;
  const navigate = useNavigate();
  const { allproduct } = useContext(ProductContext);
  const { addToCart } = useContext(ShopContext);

  // const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [lensPos, setLensPos] = useState({ x: "50%", y: "50%" });

  // Find the product by ID when allproduct loads
  useEffect(() => {
    if (allproduct?.length > 0 && productId) {
      const found = allproduct.find((p) => String(p.id) === String(productId));
      console.log("====================================");
      console.log(found, "found");
      console.log("====================================");
      if (found) setMainImage(found.image || "");
    }
  }, [productId, allproduct]);

  if (!product) {
    return <div className="productdisplay">Loading product...</div>;
  }

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLensPos({ x: `${x}%`, y: `${y}%` });
  };

  const handleAddToCart = () => {
    addToCart(product.id || product._id);
    navigate("/cart");
  };

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          {[...Array(4)].map((_, i) => (
            <img
              key={i}
              src={product.image}
              alt={`thumb-${i}`}
              onClick={() => setMainImage(product.image)}
            />
          ))}
        </div>

        <div
          className="productdisplay-main-img"
          onMouseMove={handleMouseMove}
          style={{ "--x": lensPos.x, "--y": lensPos.y }}
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
            ${product.offerPrice || "0.00"}
          </div>
          <div className="productdisplay-right-prices-new">
            ${product.price || "0.00"}
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
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div key={size} tabIndex={0}>
              {size}
            </div>
          ))}
        </div>

        <button onClick={handleAddToCart}>ADD TO CART</button>

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
