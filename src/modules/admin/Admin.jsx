import React, { Component } from "react";
import "../../Styles/Admin.css";
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
      total: null,
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
      newEntity: null,
      faculties: null
    };
  }
  componentDidMount() {
    if (this.state.selectedNav === "") {
      this.selectEntity("user");
    }
  }
  // handleAvatar = p => {
  //   let reader = new FileReader();
  //   let file = p.target.files[0];
  //   reader.onloadend = () => {
  //     this.setState({
  //       image: reader.result
  //     });
  //   };
  //   reader.readAsDataURL(file);
  // };
  getFacNames = async () => {
    this.setState({ enableScroll: false, query: {} });
    const a = await fetch(`${this.state.link}/admin/faculty`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    const b = await a.json();
    this.setState({ faculties: b.faculty });
  };
  selectUser = async p => {
    const target = p.target.id;
    if (this.state.selectedNav === "discipline") {
      this.getFacNames();
      // Selected user
      let entity = await this.state.entities.find(
        a => a[Object.keys(a)[0]].toString() === target.toString()
      );
      await this.setState({ selectedUser: entity });
    } else {
      console.log(target);

      // Selected user
      let entity = await this.state.entities.find(
        a => a[Object.keys(a)[0]].toString() === target.toString()
      );
      await this.setState({ selectedUser: entity });
      // p.target.id -> id of the selected entity in entity list NOT INDEX
      let newSelectedUser = this.state.selectedUser;
      let key = await Object.keys(entity)
        .filter(f => f.indexOf(this.state.selectedNav) === -1)
        .find(o => o.indexOf("Id") !== -1);
      if (key) {
        newSelectedUser[key] = await this.nameById(entity);
      }
      this.setState({
        selectedUser: newSelectedUser
      });
    }
  };
  nameById = async selected => {
    // Foreign key in selected entity
    let key = await Object.keys(selected)
      .filter(f => f.indexOf(this.state.selectedNav) === -1)
      .find(o => o.indexOf("Id") !== -1);
    console.log(key);

    if (!key) {
      return null;
    }
    // facultyId => faculty
    let entityToFetch = key.slice(0, key.indexOf("Id"));

    var response = await fetch(
      `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/admin/${entityToFetch}/`,
      {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    ).then(res => res.json());
    let array = response[entityToFetch];
    console.log("Response array: ", array);

    let entityByInputId = array.find(e => e.id === Number(selected[key]));
    if (!entityByInputId) {
      return null;
    }
    return entityByInputId.name;
  };

  pages = () => {
    let array = [];
    for (
      let i = 1;
      i < Math.floor(this.state.entities ? this.state.total / 10 : 0) + 2;
      i++
    ) {
      array.push(
        <Pagination.Item
          onClick={() =>
            this.loadEntities(this.state.selectedNav, "?offset=" + (i - 1) * 10)
          }
          key={i}
          id={i}
        >
          {i}
        </Pagination.Item>
      );
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
      .then(data => (data.error ? console.log(data.error) : console.log(data)))
      .catch(err => console.log(err));
  };

  loadEntities = (entityName, query) => {
    let link = query
      ? `${this.state.link}/admin/${entityName + query}`
      : `${this.state.link}/admin/${entityName}`;
    fetch(link, {
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
      .then(() => {
        if (this.state.selectedNav === "feedback") {
          let a = this.state.entities;
          a.map(entity => {
            var t = new Date(Number(entity.created) * 1000);

            var formatted = t.toLocaleString();
            entity.created = formatted;
            return entity;
          });
          this.setState({ entities: a });
        }
      })
      .then(console.log(this.state))
      .catch(err => console.log(err));
  };

  selectEntity = p => {
    this.setState({
      selectedNav: p
    });
    this.loadEntities(p, "");
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
        body = JSON.stringify({
          role: Number(this.state.selectedUser["role"])
        });
        break;
      case "teacher":
        body = JSON.stringify({
          lastName: this.state.selectedUser["lastName"],
          name: this.state.selectedUser["name"],
          middleName: this.state.selectedUser["middleName"]
        });
        break;
      case "discipline":
        body = JSON.stringify({
          name: this.state.selectedUser["name"],
          year: Number(this.state.selectedUser["year"]),
          facultyId: this.state.selectedUser["facultyId"]
        });
        break;
      case "feedback":
        window.alert("You can not modify Feedbacks");
        window.location.reload();
        break;
      case "faculty":
        body = JSON.stringify({
          name: this.state.selectedUser["name"],
          shortName: this.state.selectedUser["shortName"]
        });
        break;

      case "profession":
        body = JSON.stringify({
          name: this.state.selectedUser["name"],
          facultyId: this.state.selectedUser["facultyId"]
        });
        break;
      default:
        body = JSON.stringify({});
        break;
    }
    if (this.state.selectedNav === "feedback") return null;
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
              ? console.log(JSON.stringify(res.statusText))
              : alert(
                  `User ${this.state.email.substring(
                    0,
                    this.state.email.indexOf("@")
                  )} has been successfully created`
                )
          )
          .catch(err => console.log("Error: ", err))
      : console.log("canceled");
    this.loadEntities(this.state.selectedNav, "");
  };
  deleteItem = async () => {
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

    this.loadEntities(this.state.selectedNav, "");
  };
  postEntity = () => {
    this.setState({ post: false });
    let body = this.state.selectedUser;
    var result = {},
      key;
    console.log(body);
    for (key in body) {
      if (key === "year" || key.indexOf("Id") !== -1) {
        result[key] = Number(body[key]);
      } else if (key === "id") {
        delete result[key];
      } else if (body[key] !== undefined && body[key] !== null) {
        result[key] = body[key];
      }
    }

    console.log(result);

    fetch(
      `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/admin/${this.state.selectedNav
        .toLowerCase()
        .replace(" ", "")}/`,
      {
        method: "POST",
        body: JSON.stringify(result),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    )
      .then(p => p.json())
      .then(data => (data.error ? console.log(data.error) : console.log(data)))
      .catch(err => console.log(err));
    this.loadEntities(this.state.selectedNav, "");
    // window.location.reload();
  };

  render() {
    return (
      <React.Fragment>
        <div style={{ margin: "auto" }} className="col-11 row">
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
                      style={{ cursor: "pointer" }}
                      key={u[Object.keys(u)[0]] ? u[Object.keys(u)[0]] : "new"}
                      onClick={this.selectUser.bind(this.id)}
                      className="list-group-item list-group-item-action"
                      id={u[Object.keys(u)[0]]}
                    >
                      {this.state.selectedNav === "teacher"
                        ? u[Object.keys(u)[1]] +
                          " " +
                          u[Object.keys(u)[2]] +
                          " " +
                          u[Object.keys(u)[3]]
                        : u[Object.keys(u)[1]]}

                      <MdEdit style={{ float: "right" }} />
                    </div>
                  ))
                : ""}
              <br />
              <Pagination
                style={this.state.total < 10 ? { display: "none" } : {}}
              >
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
              this.state.selectedNav === "discipline" ? (
                <div>
                  <h2>
                    {
                      this.state.selectedUser[
                        Object.keys(this.state.selectedUser)[1]
                      ]
                    }
                  </h2>
                  <div className="list-group">
                    {Object.keys(this.state.selectedUser)
                      .slice(1)
                      .map(o =>
                        o === "facultyId" ? (
                          <div key={o ? o : -1}>
                            <span>
                              {o.charAt(0).toUpperCase() + o.slice(1)}:
                            </span>
                            <div>
                              <select
                                className="list-group-item list-group-item-action"
                                type="text"
                                onChange={p => {
                                  const a = this.state.selectedUser;
                                  a[o] = Number(p.target.value);
                                  this.setState({ selectedUser: a });
                                }}
                              >
                                {this.state.faculties
                                  ? this.state.selectedUser[
                                      Object.keys(this.state.selectedUser)[0]
                                    ]
                                    ? this.state.faculties.map(a => (
                                        <option
                                          key={a.id}
                                          value={a.id}
                                          selected={
                                            a.id === this.state.selectedUser[o]
                                          }
                                        >
                                          {a.name} ({a.shortName})
                                        </option>
                                      ))
                                    : this.state.faculties.map(a => (
                                        <option key={a.id} value={a.id}>
                                          {a.name} ({a.shortName})
                                        </option>
                                      ))
                                  : ""}
                              </select>

                              <hr />
                            </div>
                          </div>
                        ) : (
                          <div key={o ? o : -1}>
                            <span>
                              {o.charAt(0).toUpperCase() + o.slice(1)}:
                            </span>
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
                          </div>
                        )
                      )}
                  </div>
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
              ) : (
                <div>
                  <h2>
                    {
                      this.state.selectedUser[
                        Object.keys(this.state.selectedUser)[1]
                      ]
                    }
                  </h2>
                  <div className="list-group">
                    {Object.keys(this.state.selectedUser)
                      .slice(1)
                      .map(o => (
                        <div key={o ? o : -1}>
                          <span>{o.charAt(0).toUpperCase() + o.slice(1)}:</span>
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
                        </div>
                      ))}
                  </div>
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
              )
            ) : (
              ""
            )}
            {this.state.selectedNav !== "user" &&
            this.state.selectedNav !== "feedback" ? (
              !this.state.post ? (
                <button
                  onClick={() => {
                    let entitiesCopy = this.state.entities;

                    let objCopy = {};
                    let key;
                    for (key in entitiesCopy[0]) {
                      objCopy[key] = "";
                    }

                    entitiesCopy.unshift(objCopy);

                    // console.log(fildsForNew);
                    this.getFacNames();
                    this.setState({
                      selectedUser: objCopy,
                      entities: entitiesCopy,
                      post: true
                    });
                  }}
                  className="btn btn-outline-primary col-11"
                >
                  ADD NEW
                </button>
              ) : (
                <button
                  onClick={this.postEntity}
                  className="btn btn-outline-primary col-11"
                >
                  POST
                </button>
              )
            ) : (
              ""
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Admin;
