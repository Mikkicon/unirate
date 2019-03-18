import React, { Component } from "react";
import { Link } from "react-router-dom";
import "../Styles/Admin.css";
import "bootstrap";
import Pagination from "react-bootstrap/Pagination";
// import { DropdownButton, Dropdown } from "react-bootstrap";
import { Navbar, Nav } from "react-bootstrap";
import avatar from "../media/avatar.png";
class Admin extends Component {
  state = {
    discipline: null,
    disciplines: null,
    enableSave: false,
    entities: [],
    users: [
      {
        login: "mikkicon",
        email: "mikkicon@gmail.com",
        rating: 74,
        role: 1,
        professionId: 1,
        totalFeedbackNumber: 0
      },
      {
        login: "riepkin",
        email: "riepkin@gmail.com",
        rating: 80,
        role: 0,
        professionId: 2,
        totalFeedbackNumber: 0
      }
    ],
    disciplines: [
      { id: 1, name: "OOP", year: 2, faculty_id: 1 },
      { id: 2, name: "Procedure programming", year: 2, faculty_id: 1 },
      { id: 3, name: "OBDZ", year: 3, faculty_id: 1 },
      { id: 4, name: "Algorithms", year: 2, faculty_id: 1 },
      { id: 5, name: "English", year: 1, faculty_id: 2 },
      { id: 6, name: "English lit", year: 3, faculty_id: 2 },
      { id: 7, name: "Economics", year: 2, faculty_id: 777 },
      { id: 8, name: "History", year: 2, faculty_id: 777 }
    ],
    feedback: [
      (1, 71, 5, "The best OOP", 1550096124, 0, "simple_user", 1),
      (2, null, 10, "Good oop", 1550096024, 1550096074, "not_human", 1),
      (3, 99, -5, "BAD OOP", 1550096125, 0, "not_human", 1),
      (4, 100, 100, "IZI", 1550096063, 1550096074, "simple_user", 3),
      (5, null, 50, "LOL OBDZ", 1550096124, 0, "not_human", 3),
      (6, null, 20, "Procedure ok", 1550096124, 0, "simple_user", 2)
    ],
    image: avatar,
    number: 3,
    page: 1,
    selectedNav: "",

    selectedUser: null,
    userinfo: {
      login: "testLogin",
      email: "",
      password: "fdsafdsa",
      role: "",
      profession: ""
    }
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
  selectUser = p => {
    console.log("Selected user:", p.target);
    this.setState({
      selectedUser: this.state.entities.find(
        a => a[Object.keys(a)[0]] == p.target.id
      )
    });
  };
  pages = () => {
    let array = [];
    for (let i = 1; i < Math.floor(this.state.entities.length / 20) + 2; i++) {
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
  selectEntity = p => {
    switch (p.target.id) {
      case "USERS":
        return this.setState({
          selectedNav: p.target.text,
          entities: this.state[p.target.id.toLowerCase()]
        });
        break;
      case "TEACHERS":
        return this.setState({
          selectedNav: p.target.text,
          entities: this.state[p.target.id.toLowerCase()]
        });
        break;
      case "DISCIPLINES":
        return this.setState({
          selectedNav: p.target.text,
          entities: this.state[p.target.id.toLowerCase()]
        });
        break;
      case "FEEDBACKS":
        return this.setState({
          selectedNav: p.target.text,
          entities: this.state[p.target.id.toLowerCase()]
        });
        break;
      case "FACULTIES":
        return this.setState({
          selectedNav: p.target.text,
          entities: this.state[p.target.id.toLowerCase()]
        });
        break;
      case "PROFESSIONS":
        return this.setState({
          selectedNav: p.target.text,
          entities: this.state[p.target.id.toLowerCase()]
        });
        break;
      default:
        console.log(p.target.id);
        break;
    }
  };
  putEntity = () => {
    window.confirm("Are you sure you want to update user?")
      ? // fetch(`http://localhost:3001/admin/${this.state.userinfo.login}`, {
        fetch(
          `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/admin/${this.state.selectedNav
            .toLowerCase()
            .replace(" ", "")}/${
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
    // console.log(this.state.entities);
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
              <button
                onClick={this.deleteAccount}
                className="btn btn-outline-danger col-12"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
        <div style={{ margin: "auto" }} className="col-10 row">
          <div>
            <br />
            <br />
            <Navbar title="LOAD">
              <Nav.Link id="USERS" onClick={this.selectEntity.bind(this)}>
                {" "}
                USERS
              </Nav.Link>
              <Nav.Link id="TEACHERS" onClick={this.selectEntity.bind(this)}>
                TEACHERS
              </Nav.Link>
              <Nav.Link id="DISCIPLINES" onClick={this.selectEntity.bind(this)}>
                DISCIPLINES
              </Nav.Link>
              <Nav.Link id="FEEDBACKS" onClick={this.selectEntity.bind(this)}>
                FEEDBACKS
              </Nav.Link>
              <Nav.Link id="FACULTIES" onClick={this.selectEntity.bind(this)}>
                FACULTIES
              </Nav.Link>
              <Nav.Link id="PROFESSIONS" onClick={this.selectEntity.bind(this)}>
                PROFESSIONS
              </Nav.Link>
            </Navbar>
          </div>
          <div className=" row userList col-6">
            <h3>{this.state.selectedNav}</h3>
            <div className="list-group col-12">
              {this.state.entities.map(u => (
                // Object.keys(result.data.sectionList)[0]
                <div
                  key={u[Object.keys(u)[0]]}
                  onClick={this.selectUser.bind(this.id)}
                  className="list-group-item list-group-item-action"
                  id={u[Object.keys(u)[0]]}
                >
                  {u[Object.keys(u)[0]]}
                </div>
              ))}
              <br />
              <Pagination>
                <Pagination.First />
                <Pagination.Prev
                  disabled={
                    this.state.entities.length < 1 || this.state.page < 2
                  }
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
