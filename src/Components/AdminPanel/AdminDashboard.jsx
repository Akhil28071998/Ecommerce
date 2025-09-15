import React from "react";
import { Link } from "react-router-dom";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Welcome Admin 👑</h1>
        <p>Manage your store efficiently from here</p>
      </header>

      <div className="dashboard-cards">
        <Link to="/admin/products" className="dashboard-card">
          <h2>Products</h2>
          <p>Manage all products in your store</p>
        </Link>

        <Link to="/admin/users" className="dashboard-card">
          <h2>Users</h2>
          <p>View and manage your users</p>
        </Link>

        <Link to="/admin/orders" className="dashboard-card">
          <h2>Orders</h2>
          <p>Track and process orders</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
