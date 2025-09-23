import Breadcrums from "../Components/Breadcrums/Breadcrums";
import React, { useContext } from "react";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";
import { ProductContext } from "../Context/ProductContext";

const Product = () => {
  const { allproduct } = useContext(ProductContext);
  const { productId } = useParams();

  // Wait until allproduct is loaded
  if (!allproduct || allproduct.length === 0) {
    return <div>Loading product...</div>;
  }

  const product = allproduct.find((e) => String(e.id) === String(productId));

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div>
      <Breadcrums product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts />
    </div>
  );
};
export default ProductDisplay;
