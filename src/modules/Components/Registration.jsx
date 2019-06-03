import React, { Component } from "react";
// import { Link, Router, Switch } from "react-router-dom";
import bcrypt from "bcryptjs";
import "../../Styles/RegForm.css";
import "bootstrap";
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
    // disciplines: { 0: { name: "default", fac: 0 } },
    disciplines: null,

    discipline: null,
    response: ""
  };

  componentDidMount() {
    // fetch(
    // `${this.state.link}/auth/disciplines`
    // )
    //   .then(res => res.json())
    //   .then(disciplines => {
    //     this.setState({ disciplines });
    //     console.log("Data", disciplines);
    //   })
    //   .catch(err => console.log("Error", err));
  }
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
    const salt = "$2a$10$saltpasswordhashhashhh";
    const password = bcrypt.hashSync(this.state.password, salt);
    console.log("Hashed:", password);

    fetch(`${this.state.link}/auth/signup`, {
      method: "POST",
      body: JSON.stringify({
        login: this.state.email.substring(0, this.state.email.indexOf("@")),
        email: this.state.email,
        password: password,
        professionId: 1
      }),
      headers: { "Content-Type": "application/json" }
    })
      .then(res => {
        this.setState({ response: res.statusText });
        if (res.status.toString()[0] === "2") {
          window.location.href = "/login";
        } else {
          this.setState({ response: res.statusText });
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
          <h2>{this.state.response}</h2>

          <br />
          <label>Email</label>
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

          <label>Password</label>
          <input
            name="pass"
            style={this.state.inputError ? this.state.style : {}}
            className="form-control field"
            type="password"
            onBlur={this.handlePassword.bind(this)}
            onKeyPress={this.handleKeyPress}
          />
          <label>Confirm Password</label>
          <input
            name="conf"
            style={this.state.inputError ? this.state.style : {}}
            className="form-control field"
            type="password"
            onBlur={this.handleConfPassword.bind(this)}
            onKeyPress={this.handleKeyPress}
          />
          {/* <select
            className="form-control"
            onChange={p => this.setState({ discipline: p.target.value })}
          >
            {this.state.disciplines ? (
              Object.keys(this.state.disciplines).map(k => (
                <option className="dropdown-item" key={k}>
                  {this.state.disciplines[k].name}
                </option>
              ))
            ) : (
              <option className="dropdown-item" key={1} hidden defaultValue>
                Choose your profession
              </option>
            )} */}
          {/* </select> */}
          <button
            type="submit"
            disabled={
              this.state.inputError ||
              this.state.email === "" ||
              this.state.password === ""
            }
            onClick={this.submitValues}
            className="btn btn-outline-primary col-12"
            data-toggle="tooltip"
            title="Something isn't right"
          >
            Register
          </button>
        </div>
      </React.Fragment>
    );
  }
}

export default Registration;
