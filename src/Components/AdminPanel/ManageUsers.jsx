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
        const [usersRes, purchasesRes] = await Promise.all([
          fetch("http://localhost:5000/users"),
          fetch("http://localhost:5000/purchases"),
        ]);

        if (!usersRes.ok) throw new Error("Failed to fetch users");
        if (!purchasesRes.ok) throw new Error("Failed to fetch purchases");

        const [usersData, purchasesData] = await Promise.all([
          usersRes.json(),
          purchasesRes.json(),
        ]);

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

  if (loading) return <p className="status-msg">Loading users...</p>;
  if (error) return <p className="status-msg error">Error: {error}</p>;
  if (!users.length && !purchases.length)
    return <p className="status-msg">No data found</p>;

  // Registered users purchases
  const getUserPurchases = (userId) =>
    purchases.filter((p) => String(p.userId) === String(userId));

  // Guest purchases
  const guestPurchases = purchases.filter((p) => p.userId === "guest");

  return (
    <div className="manage-users">
      <h2 className="page-heading">👥 Manage Users & Purchases</h2>

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User Name</th>
              <th>Email</th>
              <th>Purchases</th>
            </tr>
          </thead>
          <tbody>
            {/* Registered Users */}
            {users.map((user) => {
              const userPurchases = getUserPurchases(user.id);
              return (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email || "N/A"}</td> {/* Always use users email */}
                  <td>
                    {userPurchases.length ? (
                      <ul>
                        {userPurchases.map((p) => (
                          <li key={p.id}>
                            <img src={p.image} alt={p.productName} width="50" />
                            {p.productName} × {p.quantity} — ${p.price}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span>No purchases yet</span>
                    )}
                  </td>
                </tr>
              );
            })}

            {/* Guest Purchases */}
            {guestPurchases.length > 0 && (
              <>
                <tr>
                  <td
                    colSpan="3"
                    style={{ fontWeight: "bold", textAlign: "center" }}
                  >
                    Guest Purchases
                  </td>
                </tr>
                {guestPurchases.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name || "Guest User"}</td>
                    <td>{p.email || "N/A"}</td>
                    <td>
                      <img src={p.image} alt={p.productName} width="50" />{" "}
                      {p.productName} × {p.quantity} — ${p.price}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUsers;
