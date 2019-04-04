import React, { Component } from "react";
import "../Styles/Admin.css";
import "bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { Navbar, Nav } from "react-bootstrap";
import { MdEdit } from "react-icons/md";
// import avatar from "../media/avatar.png";
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
      // image: avatar,
      number: 3,
      page: 1,
      selectedNav: "",
      selectedUser: null,
      viewEntity: {},
      userinfo: {
        login: "",
        email: "",
        password: "",
        role: "",
        profession: ""
      },
      post: false,
      newEntity: null
    };
  }
  componentDidMount() {
    if (this.state.selectedNav === "") {
      this.selectEntity("discipline");
    }
  }
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
              total: res.total,
              newEntity: res[entityName][0]
            })
          : this.setState({ entities: [], total: 0 })
      )
      .then(console.log(this.state))
      .catch(err => console.log(err));
  };

  selectEntity = p => {
    this.setState({
      selectedNav: p,
      entities: this.loadEntities(p)
    });
  };
  updateField = (e, o) => {
    const a = this.state.viewEntity;
    a[o] = e;
    this.setState({ viewEntity: a });
  };
  putEntity = () => {
    let body = null;
    switch (this.state.selectedNav) {
      case "user":
        break;
      case "teacher":
        body = JSON.stringify({
          lastName: this.state.selectedUser["lastName"],
          name: Number(this.state.selectedUser["name"]),
          middleName: this.state.selectedUser["middleName"]
        });
        break;
      case "discipline":
        body = JSON.stringify({
          name: this.state.selectedUser["name"],
          year: Number(this.state.selectedUser["year"]),
          facultyId: this.state.selectedUser["facultyId"]
        });
      case "feedback":
        break;
      case "faculty":
        break;

      case "profession":
        break;
      default:
        break;
    }
    window.confirm("Are you sure you want to update user?")
      ? fetch(
          `${
            this.state.link
          }/admin/${this.state.selectedNav.toLowerCase().replace(" ", "")}/${
            this.state.selectedUser[Object.keys(this.state.selectedUser)[0]]
          }`,
          {
            method: "PUT",
            body: body,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token")
            }
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
  deleteItem = () => {
    window.confirm("Are you sure?")
      ? fetch(
          `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/admin/${this.state.selectedNav
            .toLowerCase()
            .replace(" ", "")}/${
            this.state.selectedUser[Object.keys(this.state.selectedUser)[0]]
          }`,
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
                  `Discipline '${this.state.discipline.name}' was ` +
                    JSON.stringify(data.statusText)
                )
              : alert(
                  `Discipline ${
                    this.state.discipline.name
                  } has been successfully deleted`
                )
          )
          .catch(err => console.log(err))
      : console.log("You've decided not to delete discipline.:)");
  };
  postEntity = () => {
    let body = this.state.selectedUser;
    var result = {},
      key;
    for (key in body) {
      if (body[key] !== undefined && body[key] !== null) {
        result[key] = body[key];
      }
    }
    body = result.year
      ? Object.keys(result).map(c =>
          c === "year" || c.indexOf("Id") !== -1 || c.indexOf("id") !== -1
            ? (result[c] = Number(result[c]))
            : result[c]
        )
      : result;
    // .slice(1);
    // delete body[Object.keys(body)[0]];
    console.log(body);

    fetch(
      `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/admin/${this.state.selectedNav
        .toLowerCase()
        .replace(" ", "")}/`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    )
      .then(p => p.json())
      .then(data => (data.error ? alert(data.error) : console.log(data)))
      .catch(err => alert(err));
    // window.location.reload();
  };
  render() {
    return (
      <React.Fragment>
        <div style={{ margin: "auto" }} className="col-10 row">
          <div>
            <br />
            <br />
            <Navbar title="LOAD">
              <Nav.Link id="user" onClick={() => this.selectEntity("user")}>
                USERS
              </Nav.Link>
              <Nav.Link
                id="teacher"
                onClick={() => this.selectEntity("teacher")}
              >
                TEACHERS
              </Nav.Link>
              <Nav.Link
                id="discipline"
                onClick={() => this.selectEntity("discipline")}
              >
                DISCIPLINES
              </Nav.Link>
              <Nav.Link
                id="feedback"
                onClick={() => this.selectEntity("feedback")}
              >
                FEEDBACKS
              </Nav.Link>
              <Nav.Link
                id="faculty"
                onClick={() => this.selectEntity("faculty")}
              >
                FACULTIES
              </Nav.Link>
              <Nav.Link
                id="profession"
                onClick={() => this.selectEntity("profession")}
              >
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
                      {u[Object.keys(u)[1]]}{" "}
                      <div style={{ float: "right" }}>
                        <MdEdit />
                      </div>
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
            {this.state.selectedUser ? (
              <div>
                <h2>
                  {
                    this.state.selectedUser[
                      Object.keys(this.state.selectedUser)[1]
                    ]
                    // .slice(
                    //   0,
                    //   Object.keys(this.state.selectedUser)[1].indexOf("@")
                    // )
                  }
                </h2>
                <div className="list-group">
                  {Object.keys(this.state.selectedUser)
                    .slice(1)
                    .map(o => (
                      <div key={o ? o : -1}>
                        <span>{o.charAt(0).toUpperCase() + o.slice(1)}:</span>
                        {/* {o === "role" || o === "year" || o === "faculty_id" ? ( */}
                        <div>
                          <input
                            type="text"
                            onChange={e => {
                              const sel = this.state.selectedUser;
                              sel[o] = e.target.value;
                              this.setState({ selectedUser: sel });
                            }}
                            className="list-group-item list-group-item-action"
                            value={this.state.selectedUser[o]}
                          />

                          <hr />
                        </div>
                        {/* ) : (
                        <div>
                          {this.state.selectedUser[o]}

                          <hr />
                        </div>
                      )} */}
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              ""
            )}
            {this.state.selectedNav !== "user" ? (
              !this.state.post ? (
                <button
                  onClick={() => {
                    let entitiesCopy = this.state.entities;

                    let objCopy = {};
                    let key;
                    for (key in entitiesCopy[0]) {
                      objCopy[key] = entitiesCopy[key];
                    }

                    entitiesCopy.unshift(objCopy);

                    // console.log(fildsForNew);

                    this.setState({
                      selectedUser: objCopy,
                      entities: entitiesCopy,
                      post: true
                    });
                  }}
                  className="btn btn-outline-primary"
                >
                  ADD NEW
                </button>
              ) : (
                <button
                  onClick={this.postEntity}
                  className="btn btn-outline-primary"
                >
                  POST
                </button>
              )
            ) : (
              ""
            )}
            <button
              onClick={this.putEntity}
              className="btn btn-outline-primary"
            >
              SAVE
            </button>
            <button
              onClick={this.deleteItem}
              className="btn btn-outline-danger"
            >
              DELETE
            </button>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Admin;
