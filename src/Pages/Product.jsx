import React, { useContext } from "react";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import Breadcrums from "../Components/Breadcrums/Breadcrums";
import { ShopContext } from "../Context/ShopContext";
import { useParams } from "react-router-dom";
import DescriptionBox from "../Components/DescriptionBox/DescriptionBox";
import RelatedProducts from "../Components/RelatedProducts/RelatedProducts";
import { ProductContext } from "../Context/ProductContext";

const Product = () => {
  const { allproduct } = useContext(ProductContext);
  const { productId } = useParams();
  const product = allproduct.find((e) => e.id == productId);

  return (
    <div>
      <Breadcrums product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox />
      <RelatedProducts />
    </div>
  );
};

export default Product;
