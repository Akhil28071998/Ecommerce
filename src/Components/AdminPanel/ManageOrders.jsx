import React, { useEffect, useState } from "react";
import "./ManageOrders.css";

const ManageOrders = () => {
  const [purchases, setPurchases] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch users first
    fetch("http://localhost:5000/users")
      .then((res) => res.json())
      .then((data) => setUsers(data));

    // Fetch purchases
    fetch("http://localhost:5000/purchases")
      .then((res) => res.json())
      .then((data) => setPurchases(data));
  }, []);

  const getUserInfo = (userId, field) => {
    const user = users.find((u) => u.id === userId);
    return user ? user[field] : "";
  };

  return (
    <div className="manage-orders">
      <h2>Manage Orders</h2>
      {purchases.length === 0 ? (
        <p>No purchases yet.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Address</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {purchases.map((purchase) => (
              <tr key={purchase.id}>
                <td>{purchase.id}</td>
                <td>{getUserInfo(purchase.userId, "name")}</td>
                <td>{getUserInfo(purchase.userId, "email")}</td>
                <td>{getUserInfo(purchase.userId, "mobile")}</td>
                <td>{getUserInfo(purchase.userId, "address")}</td>
                <td>{purchase.productName}</td>
                <td>{purchase.quantity}</td>
                <td>{new Date(purchase.date).toLocaleString()}</td>
                <td>
                  <span className={`status ${purchase.status || "Pending"}`}>
                    {purchase.status || "Pending"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageOrders;
