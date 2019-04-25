import React, { Component } from "react";
import "../../Styles/Admin.css";
import "bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { Dropdown, DropdownButton, ButtonToolbar } from "react-bootstrap";
// import avatar from "../media/avatar.png";
class AdminUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      entities: [],
      page: 1,
      total: null,
      selectedUser: null,
      post: false,
      newEntity: null,
      faculties: null,
      professions: null,
      response: null,
      query: null,
      theme: false
    };
  }
  componentDidMount() {
    this.search("");
    this.getFacNames();
  }
  getFacNames = async () => {
    this.setState({ query: {} });
    fetch(`${this.state.link}/admin/faculty`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => this.setState({ faculties: data.faculty }));
    fetch(`${this.state.link}/admin/profession`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => this.setState({ professions: data.profession }));
  };
  selectuser = async p => {
    const entities = this.state.entities;

    if (this.state.post) {
      entities.shift();
      this.setState({ entities });
    }
    const target = p.target.id;

    this.getFacNames();
    // Selected user
    let entity = await this.state.entities.find(
      a => a[Object.keys(a)[0]].toString() === target.toString()
    );
    await this.setState({ selectedUser: entity, post: false });
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
          onClick={() => this.search({ offset: (i - 1) * 10 })}
          key={i}
          id={i}
        >
          {i}
        </Pagination.Item>
      );
    }
    return array;
  };

  putEntity = () => {
    let body = null;
    const { link, selectedUser } = this.state;
    body = JSON.stringify({
      role: Number(selectedUser["role"])
    });
    window.confirm("Are you sure you want to update user?")
      ? fetch(`${link}/admin/user/${selectedUser["login"]}`, {
          method: "PUT",
          body: body,
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
          .then(res => this.setState({ response: res.statusText }))
          .catch(err => console.log("Error: ", err))
      : console.log("canceled");
    this.search("");
    this.selectEntity();
  };
  deleteEntity = async () => {
    window.confirm("Are you sure?")
      ? fetch(
          `${this.state.link}/admin/user/${
            this.state.selectedUser[Object.keys(this.state.selectedUser)[0]]
          }`,
          {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
          .then(data =>
            data.status !== 200
              ? alert(
                  `user '${this.state.selectedUser.name}' was ` +
                    JSON.stringify(data.statusText)
                )
              : alert(
                  `user ${
                    this.state.selectedUser.name
                  } has been successfully deleted`
                )
          )
          .catch(err => console.log(err))
      : console.log("You've decided not to delete user.:)");

    this.search("");
  };
  search = async input => {
    if (input.search) {
      await this.setState({ entities: [] });
    }
    var users = this.state.entities;
    var query = Object.keys(input).reduce(
      (total, current) => total + current + "=" + input[current] + "&",
      ""
    );
    query = query ? "?" + query.slice(0, -1) : "";
    console.log("Search params:", query ? query : "user");

    fetch(`${this.state.link}/admin/user/${input ? query : ""}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(res =>
        res.total
          ? this.setState({
              entities: res["user"] ? res["user"] : users,
              total: res.total
            })
          : this.setState({ entities: [], total: 0 })
      )
      .catch(err => console.log(err));
  };

  selectEntity = entity => {
    this.search("");
  };

  render() {
    const {
      entities,
      page,
      total,
      selectedUser,
      faculties,
      response,
      query,
      theme
    } = this.state;

    return (
      <React.Fragment>
        <div style={{ margin: "auto" }} className="col-11 row">
          <div className="row">
            <br />
            <br />
            <div className={theme ? "userListBlack col-6" : "userList col-6"}>
              <ButtonToolbar>
                <a
                  onClick={() => {
                    this.getFacNames();
                  }}
                  className="btn btn-outline-primary"
                  data-toggle="collapse"
                  href="#filter"
                  role="button"
                  aria-expanded="false"
                >
                  FILTER
                </a>
                <b />
                <DropdownButton
                  variant="outline-warning"
                  id="dropdown-basic-button"
                  title="SORT"
                >
                  <Dropdown.Item
                    onClick={() => {
                      this.search({ orderBy: "login" });
                    }}
                    key="a-asc"
                  >
                    Alphabet A->Z
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      this.search({ orderBy: "login DESC" });
                    }}
                    key="a-desc"
                  >
                    Alphabet Z->A
                  </Dropdown.Item>
                </DropdownButton>
                <div className="toolItem">
                  {/* <small>infinite scroll</small> */}
                  <label className="switch">
                    <input
                      checked={this.state.enableScroll}
                      type="checkbox"
                      onChange={() =>
                        theme
                          ? this.setState({ theme: false })
                          : this.setState({ theme: true })
                      }
                    />
                    <span className="slider round" />
                  </label>
                </div>

                <div className="toolItem">
                  <h4>Found {this.state.total}</h4>
                </div>
              </ButtonToolbar>
              <div className="collapse" id="filter">
                <div className="card card-body">
                  <div className="row">
                    <b className=" col-3">Faculty</b>
                    <select
                      className="form-control col-9"
                      type="text"
                      // value={this.state.facVal}
                      placeholder="Faculty Name"
                      onChange={p => {
                        const a = query;
                        a["facultyId"] = Number(p.target.value);
                        this.setState({ query: a });
                        this.search(a);
                      }}
                    >
                      {faculties
                        ? faculties.map(a => (
                            <option key={a.id} value={a.id}>
                              {a.name} ({a.shortName})
                            </option>
                          ))
                        : ""}
                    </select>
                  </div>
                  <hr />
                  <div className="row">
                    <b className=" col-3">Year</b>
                    <select
                      className="form-control col-9"
                      placeholder="Year"
                      onChange={p => {
                        const a = query;
                        if (p.target.value === "All") {
                          delete a["year"];
                        } else {
                          a["year"] = Number(p.target.value);
                        }
                        this.setState({ query: a });
                        this.search(a);
                      }}
                    >
                      <option>All</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                    </select>
                  </div>
                  <div>
                    <hr />
                    <div className="row">
                      <b className=" col-3">mandatoryProfessionId</b>
                      <select
                        className="form-control col-9"
                        placeholder="mandatoryProfessionId"
                        onChange={p => {
                          const a = query;
                          if (p.target.value === "All") {
                            delete a["mandatoryProfessionId"];
                          } else {
                            a["mandatoryProfessionId"] = Number(p.target.value);
                          }
                          this.setState({ query: a });
                          this.search(a);
                        }}
                      >
                        <option>All</option>
                        {this.state.professions
                          ? this.state.professions.map(a => (
                              <option key={a.id} value={a.id}>
                                {a.name}
                              </option>
                            ))
                          : ""}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div style={{ margin: "auto" }} className="col-5 userList">
              <Link className="btn btn-outline-info" to="/admin-user">
                USERS
              </Link>
              <Link className="btn btn-outline-info" to="/admin-teacher">
                TEACHERS
              </Link>
              <Link className="btn btn-outline-info" to="/admin-discipline">
                DISCIPLINES
              </Link>
              <Link className="btn btn-outline-info" to="/admin-feedback">
                FEEDBACKS
              </Link>
              <Link className="btn btn-outline-info" to="/admin-faculty">
                FACULTIES
              </Link>
              <Link className="btn btn-outline-info" to="/admin-profession">
                PROFESSIONS
              </Link>
            </div>
          </div>
          <div className=" row userList col-6">
            <h3>USERS {response}</h3>
            <div className="list-group col-12">
              {entities
                ? entities.map(u => (
                    <div
                      style={{ cursor: "pointer" }}
                      key={u[Object.keys(u)[0]] ? u[Object.keys(u)[0]] : "new"}
                      onClick={this.selectuser.bind(this.id)}
                      className="list-group-item list-group-item-action"
                      id={u[Object.keys(u)[0]]}
                    >
                      {u[Object.keys(u)[1]]}

                      <MdEdit style={{ float: "right" }} />
                    </div>
                  ))
                : ""}
              <br />
              <Pagination style={total < 10 ? { display: "none" } : {}}>
                <Pagination.First />
                <Pagination.Prev disabled={entities ? page < 2 : true} />
                {this.pages()}
                <Pagination.Next />
                <Pagination.Last />
              </Pagination>
            </div>
          </div>

          <div className="userView col-5">
            {selectedUser ? (
              this.state.selectedNav === "discipline" ? (
                <div>
                  <h2>{selectedUser[Object.keys(selectedUser)[1]]}</h2>
                  <div className="list-group">
                    {Object.keys(selectedUser)
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
                                  const a = selectedUser;
                                  a[o] = Number(p.target.value);
                                  this.setState({ selectedUser: a });
                                }}
                              >
                                {faculties
                                  ? selectedUser[Object.keys(selectedUser)[0]]
                                    ? faculties.map(a => (
                                        <option
                                          key={a.id}
                                          value={a.id}
                                          selected={a.id === selectedUser[o]}
                                        >
                                          {a.name} ({a.shortName})
                                        </option>
                                      ))
                                    : faculties.map(a => (
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
                                  const sel = selectedUser;
                                  sel[o] = e.target.value;
                                  this.setState({ selectedUser: sel });
                                }}
                                className="list-group-item list-group-item-action"
                                value={selectedUser[o]}
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
                  <h2>{selectedUser[Object.keys(selectedUser)[1]]}</h2>
                  <div className="list-group">
                    {Object.keys(selectedUser)
                      .slice(1)
                      .map(o => (
                        <div key={o ? o : -1}>
                          {/* <span>{o.charAt(0).toUpperCase() + o.slice(1)}:</span> */}
                          {o === "role" ? (
                            <div>
                              <span>
                                {o.charAt(0).toUpperCase() + o.slice(1)}:
                              </span>
                              <input
                                type="text"
                                onChange={e => {
                                  const sel = selectedUser;
                                  sel[o] = e.target.value;
                                  this.setState({ selectedUser: sel });
                                }}
                                className="list-group-item list-group-item-action"
                                value={selectedUser[o]}
                              />

                              <hr />
                            </div>
                          ) : o === "professionId" ? (
                            <div>
                              <span>Profession: </span>
                              <div
                                type="text"
                                className="list-group-item list-group-item-action"
                              >
                                {selectedUser &&
                                this.state.professions.find(
                                  f =>
                                    f["id"] ===
                                    Number(selectedUser["professionId"])
                                )
                                  ? this.state.professions.find(
                                      f =>
                                        f["id"] ===
                                        Number(selectedUser["professionId"])
                                    ).name
                                  : "Hasn't specified"}
                              </div>

                              <hr />
                            </div>
                          ) : (
                            <div>
                              <span>
                                {o.charAt(0).toUpperCase() + o.slice(1)}:
                              </span>
                              <div
                                type="text"
                                className="list-group-item list-group-item-action"
                              >
                                {this.state.selectedUser[o]
                                  ? this.state.selectedUser[o]
                                  : ""}
                              </div>

                              <hr />
                            </div>
                          )}
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
                    onClick={this.deleteEntity}
                    className="btn btn-outline-danger"
                  >
                    DELETE
                  </button>
                </div>
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

export default AdminUser;
