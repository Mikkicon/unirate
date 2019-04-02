import React, { Component } from "react";
import bcrypt from "bcryptjs";
import "../Styles/LoginForm.css";
import "bootstrap";
class Login extends Component {
  state = {
    link: this.props.testnet
      ? "http://localhost:3000"
      : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
    email: "",
    password: "",
    asAdmin: false,
    response: ""
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
    const salt = "$2a$10$saltpasswordhashhashhh";
    const password = bcrypt.hashSync(this.state.password, salt);
    console.log("Hashed", password);

    fetch(`${this.state.link}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        login: this.state.email,
        password: password
      }),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        let a;
        if (res.status.toString()[0] === "4") {
          this.setState({ response: res.statusText });
          a = window.confirm(res.statusText) ? "" : "";
        } else {
          a = window.confirm("Welcome!") ? "" : "";
          a = this.setState({ response: res.statusText });
        }
        return res.json();
      })
      .then(res => {
        const response = res;
        console.log(response);
        window.localStorage.setItem("token", response.token);
        window.localStorage.setItem("admin", response.isAdmin);
        window.location.href = "/";
      })
      .catch(err => (window.confirm(err) ? "" : ""));
  };
  handleKeyPress = e => {
    if (e.key === "Enter") this.submitValues();
  };
  render() {
    return (
      <React.Fragment>
        <div className="loginFormCont">
          <h1>Login</h1>
          <h2>{this.state.response}</h2>

          <br />
          <label>Login</label>
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
