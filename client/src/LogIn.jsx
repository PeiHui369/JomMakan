import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./LogIn.css";
import loginLeft from "./assets/log-in-left.jpg";
import loginRight from "./assets/log-in-right.jpg";
import logo from "./assets/logo.png";
import { AuthContext } from "./context/AuthContext";
import axios from "axios";

const LogIn = () => {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { updateUser } = useContext(AuthContext);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/auth/login",
        {
          email,
          password: pass, // pass from useState()
          //later destructuring in auth controller
          //const { username, location, email, password } = req.body;
        }
      );
      // const token = response.data.token;
      alert("Login successful");
      setEmail("");
      setPass("");
      navigate("/home");
      window.location.reload();

      // localStorage.setItem("token", token);
      updateUser(response.data);
    } catch (error) {
      alert(error.response.data.message);
      console.log("Login Error", error);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <img className="ms-4" src={logo} id="logo"></img>
      </nav>
      <div className="login-wrapper w-100 d-flex flex-row justify-content-between align-items-center">
        <img
          className="log-in-pic log-in-pic-left"
          src={loginLeft}
          alt="left log in pic"
        />
        <div className="auth-container">
          <h1>Log in to your account</h1>
          <form
            onSubmit={handleSubmit}
            className="needs-validation"
            id="auth-form"
          >
            <div className="form-group was-validated">
              <label htmlFor="emailLogIn">
                <strong>Email</strong>
              </label>
              <input
                type="email"
                className="form-control auth"
                name="emailLogIn"
                id="emailLogIn"
                // aria-describedby="emailHelp"
                placeholder="Enter email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group position-relative">
              <label htmlFor="passwordLogin">
                <strong>Password</strong>
              </label>
              <div className="position-relative">
                <input
                  name="passwordLogin"
                  id="passwordLogin"
                  className="form-control auth mb-2"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  required
                  // noValidate
                  // validated={false}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                />
                {showPassword ? (
                  <i
                    className="bi bi-eye fs-4 position-absolute me-4 pe-1 mt-2 end-0 top-0"
                    onClick={handleClickShowPassword}
                    style={{ cursor: "pointer" }}
                  ></i>
                ) : (
                  <i
                    className="bi bi-eye-slash fs-4 position-absolute me-4 pe-1 mt-2 end-0 top-0"
                    onClick={handleClickShowPassword}
                    style={{ cursor: "pointer" }}
                  ></i>
                )}
                <a
                  className="link-danger forgot-password "
                  href="/forgot-password"
                >
                  Forgot Password ?
                </a>
              </div>
              {/* <PasswordStrengthMeter password={pass} /> */}
            </div>

            <button type="submit" className="mt-4" id="auth-button">
              Log In
            </button>
          </form>
          <br />

          <div>
            <strong>Don't have an account ?</strong>
          </div>
          <a className="link-danger " href="/signup">
            Click here to sign up !
          </a>
        </div>
        <img
          className="log-in-pic log-in-pic-right"
          src={loginRight}
          alt="right log in pic"
        />
      </div>
    </div>
  );
};

export default LogIn;
