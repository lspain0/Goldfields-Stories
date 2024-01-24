import React, { useState } from "react";
import Logo from "../components/logo.js";
import "../class.css";
import axios from "../axios.js";

function SignUP() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {

      const loginEndpoint = "/users/create";
      // Make a POST request to the login endpoint with email and password
      const response = await axios.post(loginEndpoint, {
        email,
        password,
        name: name
      });
      console.log(response?.data);
      localStorage.setItem("name", response?.data?.name);
      localStorage.setItem("email", response?.data?.email);
      localStorage.setItem("token", response?.data?.token);

      setMessage(`User created successfully.`);

      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);

    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
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
    {/* Adding hardcode background to body*/}
    <style>
      {`
        body {
          background: linear-gradient(90deg, rgba(233, 175, 12, 1) 0%, rgba(233, 175, 12, 1) 0%, rgba(50, 108, 111, 1) 100%);
          margin: 0;
          padding: 0;
        }
      `}
    </style>
    <div className="class-form-container-login">
      <div className="logo-container">
        <Logo />
      </div>
      <div className="">
        <h1 className="heading-login">CREATE ACCOUNT</h1>
        <div className="">

          <form onSubmit={handleSubmit} className="class-form">
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="login"

              required
            />
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
              Sign Up
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

export default SignUP;
