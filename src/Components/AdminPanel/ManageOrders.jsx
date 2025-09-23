// src/Components/ManageOrders/ManageOrders.jsx
import React, { useEffect, useState } from "react";
import "./ManageOrders.css";

const ManageOrders = () => {
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, purchasesRes] = await Promise.all([
          fetch("http://localhost:5000/users"),
          fetch("http://localhost:5000/purchases"),
        ]);

        if (!usersRes.ok) throw new Error("Failed to fetch users");
        if (!purchasesRes.ok) throw new Error("Failed to fetch purchases");

        const usersData = await usersRes.json();
        const purchasesData = await purchasesRes.json();

        setUsers(usersData);
        setPurchases(purchasesData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get user details by userId
  const getUserInfo = (userId, field) => {
    if (!userId) return "Guest";
    const user = users.find((u) => String(u.id) === String(userId));
    return user ? user[field] || "N/A" : "N/A";
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;
  if (purchases.length === 0) return <p>No orders found.</p>;

  return (
    <div className="manage-orders">
      <h2>📦 Manage Orders</h2>
      <div className="table-container">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Product</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => {
              const orderId = purchase.orderId || purchase.id; // prefer orderId if available
              return (
                <tr key={purchase.id}>
                  <td>{orderId}</td>
                  <td>
                    {purchase.name || getUserInfo(purchase.userId, "name")}
                  </td>
                  <td>
                    {purchase.email || getUserInfo(purchase.userId, "email")}
                  </td>
                  <td>
                    {purchase.mobile || getUserInfo(purchase.userId, "mobile")}
                  </td>
                  <td>
                    {purchase.address ||
                      getUserInfo(purchase.userId, "address")}
                  </td>
                  <td>{purchase.productName}</td>
                  <td>{purchase.quantity}</td>
                  <td>${purchase.price}</td>
                  <td>
                    {purchase.date
                      ? new Date(purchase.date).toLocaleString("en-IN")
                      : "N/A"}
                  </td>
                  <td>
                    <span
                      className={`status ${
                        purchase.status
                          ? purchase.status.toLowerCase()
                          : "pending"
                      }`}
                    >
                      {purchase.status || "Pending"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageOrders;
