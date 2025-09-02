import React, { useState } from "react";
import "./Css/LoginSignup.css";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(false); // toggle between login & signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    agree: false,
  });

  // handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password || (!isLogin && !formData.name)) {
      alert("Please fill all required fields");
      return;
    }

    if (!isLogin && !formData.agree) {
      alert("You must agree to the Terms and Privacy Policy");
      return;
    }

    if (isLogin) {
      console.log("Login Data:", formData);
      alert("Logged in successfully!");
    } else {
      console.log("Signup Data:", formData);
      alert("Account created successfully!");
    }
  };

  return (
    <div className="loginsignup">
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
