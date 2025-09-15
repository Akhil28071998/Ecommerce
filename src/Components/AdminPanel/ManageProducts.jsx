import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./ManageProduct.css";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    offerPrice: "",
    category: "mens",
    quantity: "",
    image: null,
  });

  // ✅ Load products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Failed to fetch products", err);
    }
  };

  // ✅ Handle Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  // ✅ Handle Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct({ ...newProduct, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // ✅ Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (
      !newProduct.name ||
      !newProduct.price ||
      !newProduct.offerPrice ||
      !newProduct.quantity ||
      !newProduct.category ||
      !newProduct.image
    ) {
      toast.error("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });

      if (res.ok) {
        toast.success("Product added successfully ✅");
        setNewProduct({
          name: "",
          price: "",
          offerPrice: "",
          category: "mens",
          quantity: "",
          image: null,
        });
        fetchProducts();
      }
    } catch (err) {
      toast.error("Failed to add product");
      console.error(err);
    }
  };

  // ✅ Delete Product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    try {
      const res = await fetch(`http://localhost:5000/products/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Product deleted ✅");
        setProducts(products.filter((p) => p.id !== id));
      } else {
        toast.error("Failed to delete product ❌");
      }
    } catch (err) {
      console.error("Error deleting product:", err);
      toast.error("Error deleting product");
    }
  };

  return (
    <div className="product-management">
      <h1>Manage Products</h1>

      {/* ===== Product Form ===== */}
      <form className="product-form" onSubmit={handleAddProduct}>
        <input
          type="text"
          name="name"
          placeholder="Product Title"
          value={newProduct.name}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleChange}
        />
        <input
          type="number"
          name="offerPrice"
          placeholder="Offer Price"
          value={newProduct.offerPrice}
          onChange={handleChange}
        />
        <select
          name="category"
          value={newProduct.category}
          onChange={handleChange}
        >
          <option value="mens">Mens</option>
          <option value="womens">Womens</option>
          <option value="kids">Kids</option>
        </select>
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={handleChange}
        />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button type="submit">Add Product</button>
      </form>

      {/* ===== Product Table ===== */}
      <h2>Product List</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Category</th>
            <th>Price ($)</th>
            <th>Offer Price ($)</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.length > 0 ? (
            products.map((p) => (
              <tr key={p.id}>
                <td>
                  {p.image ? (
                    <img src={p.image} alt={p.name} width="50" />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.price}</td>
                <td>{p.offerPrice}</td>
                <td>{p.quantity}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No products available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProductManagement;
