import React, { Component } from "react";
import "../Styles/Settings.css";
import "bootstrap";
// import avatar from "../media/avatar.png";
import { Form, FormControl, FormGroup } from "react-bootstrap";
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
    // userInfo: {
    //   email: "",
    //   password: "",
    //   confirm: "",
    //   profession: ""
    // },
    // image: avatar,
    enableSave: true,
    allProfessions: []
  };
  componentDidMount() {
    console.log(window.localStorage.getItem("admin").toString() === "false");

    if (window.localStorage.getItem("admin").toString() === "false") {
      fetch(`${this.state.link}/user/${window.localStorage.getItem("login")}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      })
        .then(res => res.json())
        .then(userData => {
          if (userData.error) {
            alert(userData.error);
          } else {
            this.setState({ userData });
            console.log("Data", userData);
          }
        })
        .catch(err => console.log("Error", err));

      fetch(`${this.state.link}/profession`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      })
        .then(res => res.json())
        .then(d => {
          if (d.error) {
            alert(d.error);
          } else {
            this.setState({ allProfessions: d.profession });
            console.log("Data", d);
          }
        })
        .catch(err => console.log("Error", err));
    }
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
            .then(data =>
              data.status !== 200
                ? alert(
                    `User '${this.state.userData.login}' was ` +
                      JSON.stringify(data.statusText)
                  )
                : alert(
                    `User ${
                      this.state.userData.login
                    } has been successfully deleted`
                  )
            )
            .then(window.localStorage.clear())
            .then((window.location.href = "/login"))
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
    this.handleVerification()
      ? fetch(
          `${this.state.link}/user/${window.localStorage.getItem("login")}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify(this.state.userInfo)
          }
        )
          .then(res => res.json())
          .then(updateResponse => {
            if (updateResponse.error) {
              alert(updateResponse.error);
            } else {
              this.setState({ updateResponse });
              console.log("Data", updateResponse);
            }
            let a = window.location.reload();
          })
          .catch(err => console.log("Error", err))
      : this.setState({ error: "Error" });
  };
  render() {
    return (
      <React.Fragment>
        <div className="homeFormCont col-8">
          <h1>Settings</h1>

          {this.state.error}
          <div className="row">
            {/* <div className="col-6">
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
            </div> */}
            <div className="col-12">
              <input type="hidden" value="something" />
              <form action="">
                <label>New Email</label>
                <input
                  onChange={e => {
                    let userInfo = this.state.userInfo;
                    userInfo["email"] = e.target.value;
                    this.setState({ userInfo });
                  }}
                  className="form-control field"
                  type="text"
                />
              </form>

              <label>New Password</label>
              <input
                onChange={e => {
                  let userInfo = this.state.userInfo;
                  userInfo["password"] = e.target.value;
                  this.setState({ userInfo });
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
                    let disciplines = this.state.allProfessions;
                    let diId = disciplines.filter(
                      a => a.name === p.target.value
                    );
                    let userInfo = this.state.userInfo;
                    userInfo["professionId"] = diId[0]["id"];
                    this.setState({ userInfo });
                  }}
                >
                  {this.state.allProfessions ? (
                    Object.keys(this.state.allProfessions).map(k => (
                      <option
                        selected={
                          this.state.allProfessions[k].name ===
                          this.state.userData.professionName
                        }
                        className="dropdown-item"
                        key={k}
                      >
                        {this.state.allProfessions[k].name}
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
