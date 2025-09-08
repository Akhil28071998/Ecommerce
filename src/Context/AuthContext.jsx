import React, { createContext, useState, useEffect } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (storedUser) setCurrentUser(storedUser);
  }, []);

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

      const newUser = { name, email, password };
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
        return true;
      }
    } catch {
      toast.error("Signup failed");
      return false;
    }
  };

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
        return true;
      } else {
        toast.error("Invalid email or password");
        return false;
      }
    } catch {
      toast.error("Login failed");
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setCartItems(getDefaultCart());
    localStorage.removeItem("currentUser");
    toast.info("Logged out");
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
