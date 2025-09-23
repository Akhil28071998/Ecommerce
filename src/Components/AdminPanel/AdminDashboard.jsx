// AdminDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import "./AdminDashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  // Fetch orders, users, and products from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:5000/purchases"), // use purchases endpoint
          axios.get("http://localhost:5000/products"),
          axios.get("http://localhost:5000/users"),
        ]);

        setOrders(ordersRes.data);
        setProducts(productsRes.data);
        setUsers(usersRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);

  // Total revenue
  const totalRevenue = orders.reduce((sum, o) => sum + (o.price || 0), 0);

  // Count orders by status
  const orderStatusCount = orders.reduce((acc, o) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  // Doughnut chart data
  const doughnutData = {
    labels: Object.keys(orderStatusCount),
    datasets: [
      {
        data: Object.values(orderStatusCount),
        backgroundColor: ["#36A2EB", "#2ecc71", "#FF6384"],
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: true, text: "Order Status" },
    },
  };

  // Bar chart: sales over time
  const barData = {
    labels: orders.map((o) => new Date(o.date).toLocaleDateString()),
    datasets: [
      {
        label: "Sales ($)",
        data: orders.map((o) => o.price || 0),
        backgroundColor: "#FF6384",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Sales Over Time" },
    },
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard 👑</h1>
        <p>Overview of your store</p>
      </header>

      {/* Dashboard Cards */}
      <div className="dashboard-cards">
        <div className="card">
          <h3>Total Users</h3>
          <h2>{users.length}</h2>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <h2>{orders.length}</h2>
        </div>
        <div className="card">
          <h3>Total Products</h3>
          <h2>{products.length}</h2>
        </div>
        <div className="card">
          <h3>Total Revenue ($)</h3>
          <h2>{totalRevenue.toFixed(2)}</h2>
        </div>
      </div>

      {/* Charts */}
      <div className="dashboard-charts">
        <div className="chart">
          <h3>Sales Over Time</h3>
          <Bar data={barData} options={barOptions} />
        </div>
        <div className="chart">
          <h3>Order Status Distribution</h3>
          <Doughnut data={doughnutData} options={doughnutOptions} />
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="dashboard-transactions">
        <h3>Recent Orders</h3>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Price ($)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders
              .slice(-10)
              .reverse()
              .map((o) => (
                <tr key={o.id}>
                  <td>{new Date(o.date).toLocaleString()}</td>
                  <td>{o.name || "Unknown User"}</td>
                  <td>{o.productName || "Unknown Product"}</td>
                  <td>{o.quantity}</td>
                  <td>{o.price.toFixed(2)}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
