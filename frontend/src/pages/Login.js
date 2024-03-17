import React, { useState } from "react";
import Logo from "../components/logov2.js";
import "../class.css";
import axios from "../axios.js";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      const loginEndpoint = "/users/login";
      // Make a POST request to login endpoint of email and password
      const response = await axios.post(loginEndpoint, {
        email,
        password,
      });
      console.log(response?.data);
      localStorage.setItem("name", response?.data?.name);
      localStorage.setItem("role", response?.data?.role);
      localStorage.setItem("email", response?.data?.email);
      localStorage.setItem("token", response?.data?.token);

      setMessage(`User login successfully.`);
      setTimeout(() => {
        window.location.href = '/home';
      }, 1000);
    } catch (error) {
      if (error.response) {
        const {  data } = error.response;
        console.log(data);
        setMessage(data?.error);

      }
      else {
        setMessage("Unexpected error occured");

      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearMessage = () => {
    setMessage("");
  };

  return (
    <div>
    {/* Adding hardcode background to body */}
    <style>
      {`
        body {
          background: linear-gradient(90deg, white 0%, white 0%, white 100%);
          margin: 0;
          padding: 0;
        }
      `}
    </style>
    
   
    <div className="class-form-container-login" >
      <div className="logo-container2">
        <Logo />
      </div>
      <div className="">
      <h1 className="heading-login" style={{ textAlign: 'center' }}> Sign In </h1>
        <div className="">

          <form onSubmit={handleSubmit} className="class-form">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login"

              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login"
              required
            />
            <button type="submit" disabled={isSubmitting} className="class-form-button submit-login">
              Login
            </button>
          </form>
        </div>
        <div className="message-wrapper">
          {message && (
            <div className="message-container">
              <p>{message}</p>
              <button className="message-close-btn" onClick={clearMessage}>
                &times;
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default Login;
