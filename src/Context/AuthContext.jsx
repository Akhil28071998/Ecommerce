import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // ⏳ add loading state

  // ✅ Load user from localStorage on refresh
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
    setLoading(false); // finish checking
  }, []);

  // ✅ SIGNUP
  const signup = async ({ name, email, password, agree }) => {
    if (!name || !email || !password || !agree) {
      toast.error("Please fill all fields & agree to terms");
      return false;
    }

    try {
      const res = await fetch(`http://localhost:5000/users?email=${email}`);
      const existing = await res.json();

      if (existing.length > 0) {
        toast.error("Email already registered");
        return false;
      }

      // By default, every signup is a normal "user"
      const newUser = { name, email, password, role: "user" };

      const createRes = await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (createRes.ok) {
        const createdUser = await createRes.json();
        localStorage.setItem("currentUser", JSON.stringify(createdUser));
        setCurrentUser(createdUser);
        toast.success(`Account created! Welcome, ${createdUser.name}`);
        return createdUser;
      }
    } catch (err) {
      toast.error("Signup failed");
      return false;
    }
  };

  // ✅ LOGIN
  const login = async (email, password) => {
    if (!email || !password) {
      toast.error("Please fill all required fields");
      return false;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/users?email=${email}&password=${password}`
      );
      const data = await res.json();

      if (data.length > 0) {
        const user = data[0];
        localStorage.setItem("currentUser", JSON.stringify(user));
        setCurrentUser(user);
        toast.success(`Welcome back, ${user.name}`);
        return user;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch (err) {
      toast.error("Login failed");
      return false;
    }
  };

  // ✅ LOGOUT
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, signup, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
