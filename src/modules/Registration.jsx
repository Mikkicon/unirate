import React, { Component } from "react";
// import { Link, Router, Switch } from "react-router-dom";
import bcrypt from "bcryptjs";
import "../Styles/RegForm.css";

class Registration extends Component {
  state = {
    link: this.props.testnet
      ? "http://localhost:3000"
      : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
    email: "",
    password: "",
    style: {
      borderColor: "#ff0000",
      boxShadow:
        "inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(255, 0, 0, 0.6)"
    },
    inputError: false,
    disciplines: null,
    discipline: null,
    response: ""
  };

  passwordInputField = name => (
    <input
      name={name}
      style={this.state.inputError ? this.state.style : {}}
      className="form-control field"
      type="password"
      onChange={
        name === "pass"
          ? this.handlePassword.bind(this)
          : this.handleConfPassword.bind(this)
      }
      onKeyPress={this.handleKeyPress}
    />
  );
  emailInputForm = () => (
    <form action="">
      <input
        name="mail"
        style={this.state.inputError ? this.state.style : {}}
        className="form-control field"
        type="text"
        onBlur={this.handleEmail.bind(this)}
        onKeyPress={this.handleKeyPress}
      />
    </form>
  );
  submitButton = () => (
    <button
      type="submit"
      disabled={
        this.state.inputError ||
        this.state.email === "" ||
        this.state.password === ""
      }
      onClick={this.submitValues}
      className="btn btn-outline-primary col-12"
    >
      Register
    </button>
  );
  componentDidMount() {}

  handleEmail(p) {
    const v = p.target.value;
    this.setState({ email: v });
    /[a-zA-Z0-9._+-]+@[a-zA-Z+-]+\.[a-z]+$/.test(p.target.value)
      ? this.setState({ inputError: false })
      : this.setState({ inputError: true });
  }

  handlePassword(p) {
    const v = p.target.value;
    this.setState({ password: v });
  }
  handleConfPassword(p) {
    const v = p.target.value;
    v === this.state.password
      ? this.setState({ inputError: false })
      : this.setState({ inputError: true });
  }
  submitValues = () => {
    const { email, password } = this.state;
    const salt = "$2a$10$saltpasswordhashhashhh";
    const passwordHash = bcrypt.hashSync(password, salt);
    console.log("Hashed:", passwordHash);
    const body = JSON.stringify({
      login: email.substring(0, email.indexOf("@")),
      email,
      password: passwordHash
    });

    fetch(`${this.state.link}/auth/signup`, {
      method: "POST",
      body,
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        if (res.status.toString()[0] === "2") {
          this.setState({ response: "Success!" });
          window.location.href = "/login";
        } else {
          this.setState({ response: "Oops, something went wrong" });
        }
      })
      .catch(err => console.log("Error: ", err));
  };
  handleKeyPress = e => {
    if (e.key === "Enter") this.submitValues();
  };

  render() {
    return (
      <React.Fragment>
        <div className="regFormCont">
          <h1>Registration</h1>
          <h4>{this.state.response}</h4>

          <br />
          <label>Email</label>
          {this.emailInputForm()}
          <label>Password</label>
          {this.passwordInputField("pass")}
          <label>Confirm Password</label>
          {this.passwordInputField("conf")}
          {this.submitButton()}
        </div>
      </React.Fragment>
    );
  }
}

export default Registration;
