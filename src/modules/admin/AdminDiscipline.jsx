import React, { Component } from "react";
import "../../Styles/Admin.css";
import "bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { MdEdit } from "react-icons/md";
import { Link } from "react-router-dom";
import { Dropdown, DropdownButton, ButtonToolbar } from "react-bootstrap";
// import avatar from "../media/avatar.png";
class AdminDiscipline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      entities: [],
      page: 1,
      total: null,
      selectedDiscipline: null,
      post: false,
      newEntity: null,
      faculties: null,
      professions: null,
      response: null,
      query: null
    };
  }
  componentDidMount() {
    this.search("");
  }
  getFacNames = async () => {
    this.setState({ query: {} });
    fetch(`${this.state.link}/admin/faculty`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => this.setState({ faculties: data.faculty }));
    fetch(`${this.state.link}/admin/profession`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => this.setState({ professions: data.profession }));
  };
  selectDiscipline = async p => {
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
    await this.setState({ selectedDiscipline: entity, post: false });
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
    const { link, selectedDiscipline } = this.state;
    let body = JSON.stringify({
      name: selectedDiscipline["name"],
      year: Number(selectedDiscipline["year"])
      // facultyId: Number(selectedDiscipline["facultyId"])
    });
    console.log(
      `${link}/admin/discipline/${
        selectedDiscipline[Object.keys(selectedDiscipline)[0]]
      }`
    );
    window.confirm("Are you sure you want to update discipline?")
      ? fetch(
          `${link}/admin/discipline/${
            selectedDiscipline[Object.keys(selectedDiscipline)[0]]
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
          .then(res => this.setState({ response: res.statusText }))
          .catch(err => console.log("Error: ", err))
      : console.log("canceled");
    this.search("");
    this.selectEntity();
  };
  deleteEntity = async () => {
    window.confirm("Are you sure?")
      ? fetch(
          `${this.state.link}/admin/discipline/${
            this.state.selectedDiscipline[
              Object.keys(this.state.selectedDiscipline)[0]
            ]
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
                  `Discipline '${this.state.selectedDiscipline.name}' was ` +
                    JSON.stringify(data.statusText)
                )
              : alert(
                  `Discipline ${
                    this.state.selectedDiscipline.name
                  } has been successfully deleted`
                )
          )
          .catch(err => console.log(err))
      : console.log("You've decided not to delete discipline.:)");

    this.search("");
  };
  search = async input => {
    if (input.search) {
      await this.setState({ entities: [] });
    }
    var disciplines = this.state.entities;
    var query = Object.keys(input).reduce(
      (total, current) => total + current + "=" + input[current] + "&",
      ""
    );
    query = query ? "?" + query.slice(0, -1) : "";
    console.log("Search params:", query ? query : "discipline");

    fetch(`${this.state.link}/admin/discipline/${input ? query : ""}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(res =>
        res.total
          ? this.setState({
              entities: res["discipline"] ? res["discipline"] : disciplines,
              total: res.total
            })
          : this.setState({ entities: [], total: 0 })
      )
      .catch(err => console.log(err));
  };
  postEntity = async () => {
    this.setState({ post: false });
    let body = {
      name: this.state.selectedDiscipline["name"],
      year: Number(this.state.selectedDiscipline["year"]),
      facultyId: this.state.selectedDiscipline["facultyId"]
    };

    fetch(`${this.state.link}/admin/discipline/`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(p => {
        // this.setState({ response: p.statusText });
        return p;
      })
      .catch(err => console.log(err));
    this.search("");

    // window.location.reload();
  };
  selectEntity = entity => {
    this.search("");
  };

  addNew = () => {
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
      selectedDiscipline: objCopy,
      entities: entitiesCopy,
      post: true
    });
  };

  render() {
    const {
      entities,
      page,
      total,
      selectedDiscipline,
      faculties,
      response,
      query
    } = this.state;

    return (
      <React.Fragment>
        <div style={{ margin: "auto" }} className="col-11 row">
          <div className="row">
            <br />
            <br />
            <div className="userList col-6">
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
                      var a = this.state.entities;
                      a = a.sort((a, b) =>
                        a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
                      );
                      this.setState({ entities: a });
                    }}
                    key="a-asc"
                  >
                    Alphabet A->Z
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      var a = this.state.entities;
                      a = a.sort((a, b) =>
                        a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
                      );
                      this.setState({ entities: a });
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
                      onChange={p =>
                        this.setState({ enableScroll: p.target.checked })
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
                      {this.state.faculties
                        ? this.state.faculties.map(a => (
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
            <h3>DISCIPLINES {response}</h3>
            <div className="list-group col-12">
              {entities
                ? entities.map(u => (
                    <div
                      style={{ cursor: "pointer" }}
                      key={u[Object.keys(u)[0]] ? u[Object.keys(u)[0]] : "new"}
                      onClick={this.selectDiscipline.bind(this.id)}
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
            {selectedDiscipline ? (
              <div>
                <h2>
                  {selectedDiscipline[Object.keys(selectedDiscipline)[1]]}
                </h2>
                <div className="list-group">
                  <div>
                    <span>Name:</span>
                    <input
                      type="text"
                      onChange={e => {
                        const sel = selectedDiscipline;
                        sel["name"] = e.target.value;
                        this.setState({ selectedDiscipline: sel });
                      }}
                      className="list-group-item list-group-item-action"
                      value={selectedDiscipline["name"]}
                    />
                    <hr />
                  </div>
                  <div>
                    <span>Year:</span>
                    <select
                      onChange={e => {
                        const sel = selectedDiscipline;
                        sel["year"] = e.target.value;
                        this.setState({ selectedDiscipline: sel });
                      }}
                      className="list-group-item list-group-item-action form-control"
                    >
                      <option>0</option>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                    </select>
                    <hr />
                  </div>
                  <div>
                    <span>Faculty:</span>
                    <select
                      className="list-group-item list-group-item-action form-control"
                      type="text"
                      onChange={p => {
                        const a = selectedDiscipline;
                        a["facultyId"] = Number(p.target.value);
                        this.setState({ selectedDiscipline: a });
                      }}
                    >
                      {faculties
                        ? selectedDiscipline["id"]
                          ? faculties.map(a => (
                              <option
                                key={a.id}
                                value={a.id}
                                selected={
                                  a.id === selectedDiscipline["facultyId"]
                                }
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
                  </div>
                </div>
                {selectedDiscipline["name"] ? (
                  <div>
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
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
            {!this.state.post ? (
              <button
                onClick={this.addNew}
                style={{ margin: "auto", marginTop: "20px" }}
                className="btn btn-outline-primary col-12"
              >
                ADD NEW
              </button>
            ) : (
              <button
                disabled={
                  !selectedDiscipline["name"] ||
                  !selectedDiscipline["facultyId"] ||
                  !selectedDiscipline["year"]
                }
                onClick={this.postEntity}
                className="btn btn-outline-primary col-11"
              >
                POST
              </button>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminDiscipline;
