import React, { useEffect, useState } from "react";
import "./ManageProduct.css";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    offerPrice: "",
    category: "",
    quantity: "",
    image: "",
  });
  const [editProduct, setEditProduct] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from JSON Server
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editProduct) setEditProduct({ ...editProduct, [name]: value });
    else setNewProduct({ ...newProduct, [name]: value });
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (editProduct) setEditProduct({ ...editProduct, image: reader.result });
      else setNewProduct({ ...newProduct, image: reader.result });
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Add product
  const handleAddProduct = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !newProduct.name ||
      !newProduct.category ||
      !newProduct.price ||
      !newProduct.quantity
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price) || 0,
          offerPrice: parseFloat(newProduct.offerPrice) || 0,
          quantity: parseInt(newProduct.quantity, 10) || 0,
        }),
      });

      const addedProduct = await res.json();
      setProducts([...products, addedProduct]);

      setNewProduct({
        name: "",
        price: "",
        offerPrice: "",
        category: "",
        quantity: "",
        image: "",
      });
      setImagePreview(null);
    } catch (err) {
      console.error("Error adding product:", err);
    }
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditProduct(product);
    setImagePreview(product.image);
  };

  // Update product
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        `http://localhost:5000/products/${editProduct.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...editProduct,
            price: parseFloat(editProduct.price) || 0,
            offerPrice: parseFloat(editProduct.offerPrice) || 0,
            quantity: parseInt(editProduct.quantity, 10) || 0,
          }),
        }
      );

      const updatedProduct = await res.json();
      setProducts(
        products.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
      );

      setEditProduct(null);
      setImagePreview(null);
    } catch (err) {
      console.error("Error updating product:", err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    try {
      await fetch(`http://localhost:5000/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(products.length / productsPerPage);

  return (
    <div className="product-management">
      <h2>Product Management</h2>

      {/* Add / Edit Product Form */}
      <form
        onSubmit={editProduct ? handleUpdateProduct : handleAddProduct}
        className="product-form"
      >
        <h3>{editProduct ? "Edit Product" : "Add Product"}</h3>

        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={editProduct ? editProduct.name : newProduct.name}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={editProduct ? editProduct.price : newProduct.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="offerPrice"
          placeholder="Offer Price"
          value={editProduct ? editProduct.offerPrice : newProduct.offerPrice}
          onChange={handleChange}
        />

        <select
          name="category"
          value={editProduct ? editProduct.category : newProduct.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
          <option value="kids">Kids</option>
        </select>

        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          value={editProduct ? editProduct.quantity : newProduct.quantity}
          onChange={handleChange}
          required
        />

        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            style={{ width: "80px", height: "80px", marginTop: "10px" }}
          />
        )}

        <button type="submit">
          {editProduct ? "Update Product" : "Add Product"}
        </button>
        {editProduct && (
          <button
            type="button"
            onClick={() => {
              setEditProduct(null);
              setImagePreview(null);
            }}
            className="cancel-btn"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Product Table */}
      <table className="products-table">
        <thead>
          <tr>
            <th>Sr. No</th>
            <th>Preview</th>
            <th>Name</th>
            <th>Price</th>
            <th>Offer</th>
            <th>Category</th>
            <th>Qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.length > 0 ? (
            currentProducts.map((p, index) => (
              <tr key={p.id}>
                {/* Sr. No (serial, not DB id) */}
                <td>{indexOfFirstProduct + index + 1}</td>
                <td>
                  {p.image && (
                    <img
                      src={p.image}
                      alt={p.name}
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}
                </td>
                <td>{p.name}</td>
                <td>${p.price}</td>
                <td>${p.offerPrice}</td>
                <td>{p.category}</td>
                <td>{p.quantity}</td>
                <td>
                  <button onClick={() => handleEditProduct(p)}>Edit</button>
                  <button onClick={() => handleDeleteProduct(p.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8">No products available.</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Buttons */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        <span className="page-info">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages || totalPages === 0}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ProductManagement;
