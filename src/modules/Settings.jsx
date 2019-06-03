import React, { Component } from "react";
import "../Styles/Settings.css";
import bcrypt from "bcryptjs";
import "bootstrap";
import avatar from "../media/avatar.png";
import Progress from "./Progress";
class Settings extends Component {
  state = {
    link: this.props.testnet
      ? "http://localhost:3000"
      : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
    discipline: null,
    userData: null,
    userInfo: {},
    error: null,
    confirm: null,
    enableSave: true,
    professions: [],
    response: null,
    image: avatar,
    feedbacks: []
  };
  componentDidMount() {
    this.getData();
  }

  deleteAccount = () => {
    if (window.localStorage.getItem("admin").toString() === "false") {
      window.confirm("Are you sure?")
        ? fetch(
            `${this.state.link}/user/${window.localStorage.getItem("login")}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token")
              }
            }
          )
            .then(data => {
              // console.log(data);

              if (Number(data.status) !== 200) {
                alert(
                  `User '${this.state.userData.login}' was ` +
                    JSON.stringify(data.statusText)
                );
              } else {
                alert(`successfully deleted`);
                window.localStorage.clear();
                window.location.href = "/login";
              }
            })
            .catch(err => console.log(err))
        : console.log("You've decided not to delete your account.:)");
    }
  };
  handleVerification = () => {
    if (
      this.state.userInfo.password &&
      this.state.confirm &&
      this.state.userInfo.password !== this.state.confirm
    ) {
      this.setState({ enableSave: false });
      return false;
    } else {
      this.setState({ enableSave: true });
      return true;
    }
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
    let info = this.state.userInfo;
    if (
      // this.state.userInfo.password &&
      // this.state.confirm &&
      // this.state.userInfo.password === this.state.confirm
      1
    ) {
      if (info.password) {
        const salt = "$2a$10$saltpasswordhashhashhh";
        info.password = bcrypt.hashSync(info.password, salt);
      }
      fetch(`${this.state.link}/user/${window.localStorage.getItem("login")}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(info)
      })
        .then(res => res.json())
        .then(updateResponse => {
          if (updateResponse.error) {
            console.log(updateResponse.error);
          } else {
            this.setState({ response: updateResponse });
            console.log("Data", updateResponse);
          }
        })
        .catch(err => console.log("Error", err));
    } else {
      this.setState({ error: "Passwords don't match" });
    }
  };
  getData = async () => {
    let response = await fetch(
      `${this.state.link}/${
        window.localStorage.getItem("admin").includes(true) ? "admin/" : ""
      }profession`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    );
    let data = await response.json();
    this.setState({ professions: data.profession });
    response = await fetch(
      `${this.state.link}/${
        window.localStorage.getItem("admin").includes(true) ? "admin/" : ""
      }feedback?user_login=${localStorage.getItem("login")}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    );
    data = await response.json();
    this.setState({ feedbacks: data.feedback });
  };

  render() {
    return (
      <React.Fragment>
        <div className="homeFormCont2 col-8">
          <h2>Settings</h2>

          {this.state.error}
          <div className="row">
            <div className="col-12">
              <img
                src={this.state.image}
                width="200px"
                height="200px"
                alt="Default logo"
              />
              <div>
                <button className="btn btn-outline-primary col-12 float-left">
                  Upload
                  <input onChange={p => this.handleAvatar(p)} type="file" />
                </button>
              </div>
            </div>
            <div className="col-12">
              {window.localStorage.getItem("admin").includes(true) ? (
                ""
              ) : (
                <Progress testnet={this.props.testnet} />
              )}
            </div>
            <div className="col-12">
              <input type="hidden" value="something" />
              <form action="">
                <label>New Email</label>
                <input
                  onChange={e => {
                    e.persist();
                    this.setState(state => ({
                      userInfo: { ...state.userInfo, email: e.target.value }
                    }));
                  }}
                  className="form-control field"
                  type="text"
                />
              </form>

              <label>New Password</label>
              <input
                onChange={e => {
                  e.persist();
                  this.setState(state => ({
                    userInfo: { ...state.userInfo, password: e.target.value }
                  }));
                }}
                className="form-control field"
                type="password"
              />
              <label>Confirm New Password</label>
              <input
                onChange={e => {
                  this.setState({ confirm: e.target.value });
                }}
                className="form-control field"
                type="password"
              />
              {window.localStorage.getItem("admin").toString() === "false" ? (
                <select
                  className="form-control"
                  onChange={p => {
                    p.persist();
                    this.setState(state => ({
                      userInfo: {
                        ...state.userInfo,
                        professionId: state.professions.find(
                          a => a.name === p.target.value
                        )
                      }
                    }));
                  }}
                >
                  {this.state.professions ? (
                    Object.keys(this.state.professions).map(k => (
                      <option className="dropdown-item" key={k}>
                        {this.state.professions[k].name}
                      </option>
                    ))
                  ) : (
                    <option
                      className="dropdown-item"
                      key={1}
                      defaultValue
                      hidden
                    >
                      Profession not set
                    </option>
                  )}
                </select>
              ) : (
                ""
              )}
              <br />
              {/* <label>Password</label>
              <input
                style={{ marginBottom: 0 }}
                className="form-control field"
                type="password"
                onChange={e => this.handleVerification(e.target.value)}
              />
              <small>
                To submit changes please enter your current password
              </small> */}
              <button
                disabled={!this.state.enableSave}
                data-toggle="tooltip"
                title="Fill all the fields correctly"
                onClick={this.submitValues}
                className="btn btn-outline-primary col-12"
              >
                Save
              </button>
              {window.localStorage.getItem("admin").toString() === "false" ? (
                <button
                  onClick={this.deleteAccount}
                  className="btn btn-outline-danger col-12"
                >
                  Delete Account
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Settings;
