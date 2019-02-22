import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../Styles/Settings.css";
import "bootstrap";
import avatar from "../media/avatar.png";
class Settings extends Component {
  state = {
    discipline: null,
    disciplines: null,
    userinfo: {
      login: "testLogin",
      email: "",
      password: "fdsafdsa",
      role: "",
      profession: ""
    },
    image: avatar,
    enableSave: false
  };
  componentDidMount() {
    // fetch(
    //   // "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/auth/disciplines"
    //   `http://localhost:3001/user/${this.state.userinfo.login}`
    // )
    //   .then(res => res.json())
    //   .then(disciplines => {
    //     if (disciplines.error) {
    //       alert(disciplines.error);
    //     } else {
    //       this.setState({ disciplines });
    //       console.log("Data", disciplines);
    //     }
    //   })
    //   .catch(err => console.log("Error", err));
  }
  deleteAccount = () => {
    window.confirm("Are you sure?")
      ? // fetch(`http://localhost:3001/user/${this.state.userinfo.login}`, {
        fetch(
          `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/user/${
            this.state.userinfo.login
          }`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
          }
        )
          .then(data =>
            data.status !== 200
              ? alert(
                  `User '${this.state.userinfo.login}' was ` +
                    JSON.stringify(data.statusText)
                )
              : alert(
                  `User ${
                    this.state.userinfo.login
                  } has been successfully deleted`
                )
          )
          .catch(err => console.log(err))
      : console.log("You've decided not to delete your account.:)");
  };
  handleVerification = p => {
    p.target.value === "fdsa"
      ? this.setState({ enableSave: true })
      : this.setState({ enableSave: false });
  };
  handleAvatar = p => {
    let reader = new FileReader();
    let file = p.target.files[0];
    reader.onloadend = () => {
      this.setState({
        image: reader.result
      });
    };
    reader.readAsDataURL(file);
    // this.setState({ discipline: p.target.value })
  };
  submitValues = () => {
    // fetch(`http://localhost:3001/user/${this.state.userinfo.login}`, {
    fetch(
      `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/user/${
        this.state.userinfo.login
      }`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" }
      }
    )
      .then(p => p.json())
      .then(data => (data.error ? alert(data.error) : console.log(data)))
      .catch(err => alert(err));
  };
  render() {
    return (
      <React.Fragment>
        <div className="homeFormCont col-10">
          <h1>Settings</h1>
          <br />
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
          <br />
          <div className="row">
            <div className="col-6">
              <img
                src={this.state.image}
                width="200px"
                height="200px"
                alt="Default logo"
              />
              <div>
                <button className="btn btn-outline-primary col-6 float-left">
                  Upload
                  <input onChange={p => this.handleAvatar(p)} type="file" />
                </button>
              </div>
            </div>
            <div className="col-6">
              <label>New Email</label>
              <input className="form-control field" type="text" />
              <label>New Password</label>
              <input className="form-control field" type="password" />
              <label>Confirm New Password</label>
              <input className="form-control field" type="password" />
              <select
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
                  <option className="dropdown-item" key={1} defaultValue hidden>
                    Choose your discipline
                  </option>
                )}
              </select>
              <br />
              <label>Password</label>
              <input
                style={{ marginBottom: 0 }}
                className="form-control field"
                type="password"
                onChange={this.handleVerification.bind(this)}
              />
              <small>
                To submit changes please enter your current password
              </small>
              <button
                disabled={!this.state.enableSave}
                data-toggle="tooltip"
                title="Fill all the fields correctly"
                onClick={this.submitValues}
                className="btn btn-outline-primary col-12"
              >
                Save
              </button>
              <button
                onClick={this.deleteAccount}
                className="btn btn-outline-danger col-12"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Settings;
