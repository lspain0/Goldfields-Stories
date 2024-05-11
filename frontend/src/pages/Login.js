import React, { useState } from "react";
import Logo2 from "../components/logov2.js";
import "../class.css";
import axios from "../axios.js";
import "../login.css";

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
      
      // Setting name, role, email, token, child, id and pass in local storage

      console.log(response?.data);
      localStorage.setItem("name", response?.data?.name);
      localStorage.setItem("role", response?.data?.role);
      localStorage.setItem("email", response?.data?.email);
      localStorage.setItem("token", response?.data?.token);
      localStorage.setItem("child", response?.data?.child);
      localStorage.setItem("id", response?.data?._id);
      localStorage.setItem("_pass", response?.data?.defaultPassword ?? "ABC");

      setMessage(`User login successfully.`);


      //If statement for user that needs to change thier password, and it will set change key in local storage to 1
      if (response?.data?.changePassword == "1") {
        localStorage.setItem("change", 1);

        setTimeout(() => {
          window.location.href = '/change_password';
        }, 1000);
      }

      //If the user doesn't need to change their password, it will redirect to home page in 1 second
      else {

        setTimeout(() => {
          window.location.href = '/home';
        }, 1000);
      }
    } catch (error) {
      if (error.response) {
        const { data } = error.response;
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
          <Logo2 />
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
                className="loginPage"

                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="loginPage"
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
