import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../Styles/Admin.css";
import "bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { Navbar, Nav } from "react-bootstrap";
import avatar from "../media/avatar.png";
class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      discipline: null,
      enableSave: false,
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      entities: [],
      image: avatar,
      number: 3,
      page: 1,
      selectedNav: "",
      selectedUser: null,
      userinfo: {
        login: "",
        email: "",
        password: "",
        role: "",
        profession: ""
      }
    };
  }

  componentWillMount() {}

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
  };
  selectUser = p => {
    // console.log("Selected user:", p.target);
    this.setState({
      selectedUser: this.state.entities.find(
        a => a[Object.keys(a)[0]].toString() === p.target.id.toString()
      )
    });
  };
  pages = () => {
    let array = [];
    for (
      let i = 1;
      i < Math.floor(this.state.entities ? this.state.total / 10 : 0) + 2;
      i++
    ) {
      array.push(<Pagination.Item key={i}> {i}</Pagination.Item>);
    }
    return array;
  };
  updateUser = p => {
    const temp = this.state.selectedUser;
    temp["role"] = p.target.value;
    this.setState({ selectUser: temp });
  };
  submitValues = () => {
    fetch(`/user/${this.state.userinfo.login}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" }
    })
      .then(p => p.json())
      .then(data => (data.error ? alert(data.error) : console.log(data)))
      .catch(err => alert(err));
  };

  loadEntities = entityName => {
    fetch(`${this.state.link}/admin/${entityName}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(res =>
        res.total
          ? this.setState({
              entities: res[entityName],
              total: res.total
            })
          : this.setState({ entities: [], total: 0 })
      )
      .then(console.log(this.state))
      .catch(err => console.log(err));
  };

  selectEntity = p => {
    this.setState({
      selectedNav: p.target.id,
      entities: this.loadEntities(p.target.id)
    });
  };
  putEntity = () => {
    window.confirm("Are you sure you want to update user?")
      ? fetch(
          `${
            this.state.link
          }/admin/${this.state.selectedNav.toLowerCase().replace(" ", "")}/${
            this.state.selectedUser[Object.keys(this.state.selectedUser)[0]]
          }`,
          {
            method: "PUT",
            body: JSON.stringify(this.state.selectedUser),
            headers: { "Content-Type": "application/json" }
          }
        )
          .then(res =>
            res.status !== 200
              ? alert(JSON.stringify(res.statusText))
              : alert(
                  `User ${this.state.email.substring(
                    0,
                    this.state.email.indexOf("@")
                  )} has been successfully created`
                )
          )
          .catch(err => console.log("Error: ", err))
      : console.log("canceled");
  };
  render() {
    return (
      <React.Fragment>
        <div className="adminFormCont col-10">
          <h1>Admin Settings</h1>
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
          <Link className="btn btn-outline-primary" to="/admin">
            Admin
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
            </div>
          </div>
        </div>
        <div style={{ margin: "auto" }} className="col-10 row">
          <div>
            <br />
            <br />
            <Navbar title="LOAD">
              <Nav.Link id="user" onClick={this.selectEntity.bind(this)}>
                USERS
              </Nav.Link>
              <Nav.Link id="teacher" onClick={this.selectEntity.bind(this)}>
                TEACHERS
              </Nav.Link>
              <Nav.Link id="discipline" onClick={this.selectEntity.bind(this)}>
                DISCIPLINES
              </Nav.Link>
              <Nav.Link id="feedback" onClick={this.selectEntity.bind(this)}>
                FEEDBACKS
              </Nav.Link>
              <Nav.Link id="faculty" onClick={this.selectEntity.bind(this)}>
                FACULTIES
              </Nav.Link>
              <Nav.Link id="profession" onClick={this.selectEntity.bind(this)}>
                PROFESSIONS
              </Nav.Link>
            </Navbar>
          </div>
          <div className=" row userList col-6">
            <h3>{this.state.selectedNav}</h3>
            <div className="list-group col-12">
              {this.state.entities
                ? this.state.entities.map(u => (
                    <div
                      key={u[Object.keys(u)[0]]}
                      onClick={this.selectUser.bind(this.id)}
                      className="list-group-item list-group-item-action"
                      id={u[Object.keys(u)[0]]}
                    >
                      {u[Object.keys(u)[0]]}
                    </div>
                  ))
                : ""}
              <br />
              <Pagination>
                <Pagination.First />
                <Pagination.Prev
                  disabled={this.state.entities ? this.state.page < 2 : true}
                />
                {this.pages()}
                <Pagination.Next />
                <Pagination.Last />
              </Pagination>
            </div>
          </div>

          <div className="userView col-5">
            {!this.state.selectedUser ? (
              console.log("No selected user")
            ) : (
              <div>
                <h2>
                  {
                    this.state.selectedUser[
                      Object.keys(this.state.selectedUser)[0]
                    ]
                  }
                </h2>
                <div className="list-group">
                  {Object.keys(this.state.selectedUser).map(o => (
                    <div key={o}>
                      <span>{o.charAt(0).toUpperCase() + o.slice(1)}:</span>
                      {o === "role" || o === "year" || o === "faculty_id" ? (
                        <div>
                          <input
                            type="text"
                            onChange={this.updateUser.bind(this)}
                            className="list-group-item list-group-item-action"
                            value={this.state.selectedUser[o]}
                          />

                          <hr />
                        </div>
                      ) : (
                        <div>
                          {this.state.selectedUser[o]}

                          <hr />
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={this.putEntity}
                    className="btn btn-outline-primary"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Admin;
