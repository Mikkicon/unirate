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
  submitValues = async () => {
    const salt = "$2a$10$saltpasswordhashhashhh";
    const password = await bcrypt.hashSync(this.state.password, salt);
    console.log("Hashed", password);

    let fetched = await fetch(`${this.state.link}/auth/login`, {
      method: "POST",
      body: JSON.stringify({
        login: this.state.email,
        password: password
      }),
      headers: { "Content-Type": "application/json" }
    });
    let a;
    if (fetched.status.toString()[0] === "4") {
      this.setState({ response: fetched.statusText });
      a = window.confirm(fetched.statusText) ? "" : "";
    } else {
      a = window.confirm("Welcome!") ? "" : "";
      a = this.setState({ response: fetched.statusText });
      const response = await fetched.json();
      console.log(response);
      window.localStorage.setItem("token", response.token);
      window.localStorage.setItem("admin", response.isAdmin);
      window.localStorage.setItem("login", this.state.email);
      window.location.href = "/";
    }
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

          {/* <form action=""> */}
          <input
            className="form-control field"
            type="text"
            onChange={this.handleEmail.bind(this)}
            onKeyPress={this.handleKeyPress}
          />
          {/* </form> */}
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
