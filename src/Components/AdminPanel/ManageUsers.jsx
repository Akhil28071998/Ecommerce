import React, { useEffect, useState } from "react";
import "./ManageUsers.css";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, purchaseRes] = await Promise.all([
          fetch("http://localhost:5000/users"),
          fetch("http://localhost:5000/purchases"),
        ]);

        if (!userRes.ok) throw new Error("Failed to fetch users");
        if (!purchaseRes.ok) throw new Error("Failed to fetch purchases");

        const [usersData, purchasesData] = await Promise.all([
          userRes.json(),
          purchaseRes.json(),
        ]);

        setUsers(usersData);
        setPurchases(purchasesData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getUserPurchases = (userId) =>
    purchases.filter((p) => String(p.userId) === String(userId));

  if (loading) return <p className="status-msg">Loading users...</p>;
  if (error) return <p className="status-msg error">Error: {error}</p>;
  if (users.length === 0) return <p className="status-msg">No users found</p>;

  return (
    <div className="manage-users">
      <h2 className="page-heading">👥 Manage Users & Purchases</h2>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User Id</th>
              <th>User Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Purchases</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const userPurchases = getUserPurchases(user.id);
              return (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name || "N/A"}</td>
                  <td>{user.email || "N/A"}</td>
                  <td className="role">{user.role || "user"}</td>
                  <td>
                    {userPurchases.length > 0 ? (
                      <ul className="purchase-list">
                        {userPurchases.map((purchase) => (
                          <li key={purchase.id} className="purchase-item">
                            <img
                              src={purchase.image}
                              alt={purchase.productName}
                              className="purchase-img"
                            />
                            <div className="purchase-info">
                              <strong>{purchase.productName}</strong> ×{" "}
                              {purchase.quantity} — ${purchase.price}
                              <br />
                              <small>
                                {purchase.date
                                  ? new Date(purchase.date).toLocaleString(
                                      "en-IN"
                                    )
                                  : "Date not available"}
                              </small>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="no-purchase">No purchases yet</span>
                    )}
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

export default ManageUsers;
