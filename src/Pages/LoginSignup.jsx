import React, { useState, useContext } from "react";
import { ToastContainer } from "react-toastify";
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let success = false;

    if (isLogin) {
      success = login(formData.email, formData.password);
    } else {
      success = signup(
        formData.name,
        formData.email,
        formData.password,
        formData.agree
      );
    }

    if (success) {
      navigate("/");
      setFormData({ name: "", email: "", password: "", agree: false });
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
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
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
