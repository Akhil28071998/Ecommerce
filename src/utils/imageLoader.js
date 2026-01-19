// Dynamically load product images based on product ID
import product_1 from "../assets/Assets/product_1.png";
import product_2 from "../assets/Assets/product_2.png";
import product_3 from "../assets/Assets/product_3.png";
import product_4 from "../assets/Assets/product_4.png";
import product_5 from "../assets/Assets/product_5.png";
import product_6 from "../assets/Assets/product_6.png";
import product_7 from "../assets/Assets/product_7.png";
import product_8 from "../assets/Assets/product_8.png";
import product_9 from "../assets/Assets/product_9.png";
import product_10 from "../assets/Assets/product_10.png";
import product_11 from "../assets/Assets/product_11.png";
import product_12 from "../assets/Assets/product_12.png";
import product_13 from "../assets/Assets/product_13.png";
import product_14 from "../assets/Assets/product_14.png";
import product_15 from "../assets/Assets/product_15.png";
import product_16 from "../assets/Assets/product_16.png";
import product_17 from "../assets/Assets/product_17.png";
import product_18 from "../assets/Assets/product_18.png";
import product_19 from "../assets/Assets/product_19.png";
import product_20 from "../assets/Assets/product_20.png";
import product_21 from "../assets/Assets/product_21.png";
import product_22 from "../assets/Assets/product_22.png";
import product_23 from "../assets/Assets/product_23.png";
import product_24 from "../assets/Assets/product_24.png";
import product_25 from "../assets/Assets/product_25.png";
import product_26 from "../assets/Assets/product_26.png";
import product_27 from "../assets/Assets/product_27.png";
import product_28 from "../assets/Assets/product_28.png";
import product_29 from "../assets/Assets/product_29.png";
import product_30 from "../assets/Assets/product_30.png";
import product_31 from "../assets/Assets/product_31.png";
import product_32 from "../assets/Assets/product_32.png";
import product_33 from "../assets/Assets/product_33.png";
import product_34 from "../assets/Assets/product_34.png";
import product_35 from "../assets/Assets/product_35.png";
import product_36 from "../assets/Assets/product_36.png";

const imageMap = {
  1: product_1,
  2: product_2,
  3: product_3,
  4: product_4,
  5: product_5,
  6: product_6,
  7: product_7,
  8: product_8,
  9: product_9,
  10: product_10,
  11: product_11,
  12: product_12,
  13: product_13,
  14: product_14,
  15: product_15,
  16: product_16,
  17: product_17,
  18: product_18,
  19: product_19,
  20: product_20,
  21: product_21,
  22: product_22,
  23: product_23,
  24: product_24,
  25: product_25,
  26: product_26,
  27: product_27,
  28: product_28,
  29: product_29,
  30: product_30,
  31: product_31,
  32: product_32,
  33: product_33,
  34: product_34,
  35: product_35,
  36: product_36,
};

export const getProductImage = (productId) => {
  const id = parseInt(productId);
  return imageMap[id] || product_1;
};
