import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../Styles/LoginForm.css";
import "bootstrap";
class Login extends Component {
  state = {
    email: "",
    password: "",
    asAdmin: false
  };
  handleEmail = p => {
    const v = p.target.value;
    // Remembering mail value for submit
    this.setState({ email: v });
    // console.log(this.state.email);
  };

  handlePassword = p => {
    const v = p.target.value;
    this.setState({ password: v });
    // console.log(this.state.email);
  };
  submitValues = () => {
    fetch(
      "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          login: this.state.email,
          password: this.state.password
        }),
        headers: { "Content-Type": "application/json" }
      }
    )
      .then(res => res.json())
      .then(response => {
        localStorage.setItem("token", response.token);
      });
  };
  handleKeyPress = e => {
    if (e.key === "Enter") this.submitValues();
  };
  render() {
    return (
      <React.Fragment>
        <div className="loginFormCont">
          <h1>Login</h1>
          <Link className="btn btn-outline-primary" to="/">
            Home
          </Link>
          <Link className="btn btn-outline-primary" to="/register">
            Registration
          </Link>
          <Link className="btn btn-outline-primary" to="/login">
            Login
          </Link>
          <Link className="btn btn-outline-primary" to="/settings">
            Settings
          </Link>
          <Link className="btn btn-outline-primary" to="/admin">
            Admin
          </Link>
          <br />
          <label>Email</label>
          <input
            className="form-control field"
            type="text"
            onChange={this.handleEmail.bind(this)}
            onKeyPress={this.handleKeyPress}
          />
          <label>Password</label>
          <input
            className="form-control field"
            type="password"
            onChange={this.handlePassword.bind(this)}
            onKeyPress={this.handleKeyPress}
          />
          <button
            onClick={this.submitValues}
            className="btn btn-outline-primary col-12"
          >
            Login
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
