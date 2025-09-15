import React, { useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";
import "./Css/LoginSignup.css";

const LoginSignup = () => {
  const navigate = useNavigate();
  const { login, signup } = useContext(AuthContext);

  const [isLogin, setIsLogin] = useState(
    () => window.location.pathname === "/login"
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agree: false,
  });

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      // ----- LOGIN -----
      const user = await login(formData.email, formData.password);

      if (user) {
        toast.success("Login successful!");

        // Navigate based on role
        if (user.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        setFormData({ name: "", email: "", password: "", agree: false });
      } else {
        toast.error("Invalid credentials!");
      }
    } else {
      // ----- SIGNUP -----
      const newUser = {
        ...formData,
        role: "user", // ✅ By default every signup is a normal user
      };

      const success = await signup(newUser);

      if (success) {
        toast.success("Signup successful! Please login.");
        setIsLogin(true);
        setFormData({ name: "", email: "", password: "", agree: false });
      } else {
        toast.error("Signup failed!");
      }
    }
  };

  return (
    <div className="loginsignup">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <div className="loginsignup-container">
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        <form className="loginsignup-fields" onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Enter Your Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Enter Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          {!isLogin && (
            <div className="loginsignup-agree">
              <input
                type="checkbox"
                name="agree"
                id="agree"
                checked={formData.agree}
                onChange={handleChange}
              />
              <label htmlFor="agree">
                By continuing, I agree to the <span>Terms of Use</span> &{" "}
                <span>Privacy Policy</span>.
              </label>
            </div>
          )}

          <button type="submit">{isLogin ? "Login" : "Continue"}</button>
        </form>

        <p className="loginsignup-login">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Sign Up here" : "Login here"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginSignup;
