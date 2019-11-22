import React, { Component } from "react";
import "../../Styles/Settings.css";
import bcrypt from "bcryptjs";
import avatar from "../../media/avatar.png";
import Progress from "../Components/Progress";
class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
    if (this.props.testnet) {
      this.link = "http://localhost:3000";
    } else {
      this.link =
        "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com";
    }

    this.isAdmin = localStorage.getItem("admin").toString() === "true";
    this.login = localStorage.getItem("login");
    this.headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token")
    };
  }

  componentDidMount() {
    this.getProfessions();
  }

  deleteAccount = async () => {
    if (!this.isAdmin && window.confirm("Are you sure?")) {
      const data = await fetch(`${this.link}/user/${this.login}`, {
        method: "DELETE",
        headers: this.headers
      });
      try {
        if (Number(data.status) !== 200) {
          alert(
            `User '${this.state.userData.login}' was ` +
              JSON.stringify(data.statusText)
          );
        } else {
          alert(`successfully deleted`);
          localStorage.clear();
          window.location.href = "/login";
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  handleAvatar = p => {
    let reader = new FileReader();
    let file = p.target.files[0];

    reader.readAsDataURL(file);
    reader.onloadend = () => {
      this.setState({
        image: reader.result
      });

      fetch(`${this.link}/image-upload`, {
        method: "POST",
        body: reader.result
      })
        .then(res => res.json())
        .then(console.log)
        .catch(console.error);
    };
  };

  saveChanges = () => {
    const { userInfo, link } = this.state;
    var userData = { ...userInfo };
    if (userData.password) {
      const salt = "$2a$10$saltpasswordhashhashhh";
      userData.password = bcrypt.hashSync(userData.password, salt);
    }
    fetch(`${link}/user/${this.login}`, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(userData)
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
    // this.setState({ error: "Passwords don't match" });
  };

  getProfessions = () => {
    var url = "";
    if (this.isAdmin) {
      url = `${this.link}/admin/profession`;
    } else {
      url = `${this.link}/profession`;
    }
    fetch(url, { headers: this.headers })
      .then(res => res.json())
      .then(data => this.setState({ professions: data.profession }))
      .catch(console.error);
  };

  imageUploadComp = () => (
    <div className="col-12">
      <img className="avatar" src={this.state.image} alt="Default logo" />
      <div>
        <button className="btn btn-outline-primary col-12 float-left">
          Upload
          <input onChange={p => this.handleAvatar(p)} type="file" />
        </button>
      </div>
    </div>
  );

  handleProfessionChange = p => {
    const professionId = this.state.professions.find(
      a => a.name === p.target.value
    );
    this.setState(state => ({
      userInfo: {
        ...state.userInfo,
        professionId
      }
    }));
  };
  selectedProfessionComp = () => (
    <select
      className="form-control"
      onChange={p => this.handleProfessionChange}
    >
      {Object.keys(this.state.professions).map(k => (
        <option className="dropdown-item" key={k}>
          {this.state.professions[k].name}
        </option>
      ))}
    </select>
  );

  notSelectedProfessionComp = () => (
    <select
      className="form-control"
      onChange={p => this.handleProfessionChange}
    >
      <option className="dropdown-item" key={1} defaultValue hidden>
        Profession not set
      </option>
    </select>
  );

  professionComp = () => {
    const { professions } = this.state;
    const isDisplayable = !this.isAdmin && professions;

    if (isDisplayable) return this.selectedProfessionComp();
    if (professions) return this.notSelectedProfessionComp();
    return null;
  };

  render() {
    return (
      <React.Fragment>
        <div className="homeFormCont2 col-8">
          <h2>Settings</h2>

          {this.state.error}
          <div className="row">
            {this.imageUploadComp()}
            <div className="col-12">
              {this.isAdmin ? "" : <Progress testnet={this.props.testnet} />}
            </div>
            <div className="col-12">
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
              {this.professionComp()}
              <br />
              {/* <label>Password</label>
              <input
                style={{ marginBottom: 0 }}
                className="form-control field"
                type="password"
                onChange={e =>
                  this.setState(state => ({
                    userInfo: { ...state.userInfo, oldPassword: e.target.value }
                  }))
                }
              />
              <small>
                To submit changes please enter your current password
              </small> */}
              <button
                disabled={!this.state.enableSave}
                data-toggle="tooltip"
                title="Fill all the fields correctly"
                onClick={this.saveChanges}
                className="btn btn-outline-primary col-12"
              >
                Save
              </button>
              {!this.isAdmin ? (
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
