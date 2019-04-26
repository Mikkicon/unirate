import React, { Component } from "react";
import "../../Styles/Admin.css";
import "bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { Dropdown, DropdownButton, ButtonToolbar } from "react-bootstrap";
// import avatar from "../media/avatar.png";
class AdminTeacher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      entities: [],
      page: 1,
      total: null,
      selectedTeacher: null,
      post: false,
      newEntity: null,
      faculties: null,
      professions: null,
      disciplines: null,
      teachers: null,
      response: null,
      query: {},
      theme: false
    };
  }
  async componentDidMount() {
    this.search("");
    await this.getFacNames();
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
    fetch(`${this.state.link}/admin/discipline`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => this.setState({ disciplines: data.discipline }));
    fetch(`${this.state.link}/admin/teacher`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => this.setState({ teachers: data.teacher }));
  };
  selectfaculty = async p => {
    const entities = this.state.entities;

    if (this.state.post) {
      entities.shift();
      this.setState({ entities });
    }
    const target = p.target.id;
    // Selected user
    let entity = await this.state.entities.find(
      a => a[Object.keys(a)[0]].toString() === target.toString()
    );
    await this.setState({ selectedTeacher: entity, post: false });
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

  deleteEntity = async () => {
    window.confirm("Are you sure?")
      ? fetch(
          `${this.state.link}/admin/teacher/${
            this.state.selectedTeacher["id"]
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
                  `faculty '${this.state.selectedTeacher.name}' was ` +
                    JSON.stringify(data.statusText)
                )
              : alert(
                  `faculty ${
                    this.state.selectedTeacher.name
                  } has been successfully deleted`
                )
          )
          .catch(err => console.log(err))
      : console.log("You've decided not to delete faculty.:)");

    this.search("");
  };
  search = async input => {
    if (input.search) {
      await this.setState({ entities: [] });
    }
    var FACULTIES = this.state.entities;
    var query = Object.keys(input).reduce(
      (total, current) => total + current + "=" + input[current] + "&",
      ""
    );
    query = query ? "?" + query.slice(0, -1) : "";
    console.log("Search params:", query ? query : "faculty");

    fetch(`${this.state.link}/admin/teacher/${input ? query : ""}`, {
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
              entities: res["teacher"] ? res["teacher"] : FACULTIES,
              total: res.total
            })
          : this.setState({ entities: [], total: 0 })
      )
      .catch(err => console.log(err));
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
      selectedTeacher: objCopy,
      entities: entitiesCopy,
      post: true
    });
  };
  putEntity = () => {
    const { link, selectedTeacher, query } = this.state;
    let body = query;

    window.confirm("Are you sure you want to update discipline?")
      ? fetch(`${link}/admin/teacher/${Number(selectedTeacher["id"])}`, {
          method: "PUT",
          body: JSON.stringify(body),
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
  postEntity = async () => {
    this.setState({ post: false });

    fetch(`${this.state.link}/admin/teacher/`, {
      method: "POST",
      body: JSON.stringify(this.state.query),
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
  };
  render() {
    const {
      entities,
      page,
      total,
      selectedTeacher,
      faculties,
      response,
      professions,
      query,
      theme
    } = this.state;

    return (
      <React.Fragment>
        <div
          style={{ margin: "auto", marginTop: "80px" }}
          className="col-11 row"
        >
          <div className="row">
            <br />
            <br />
            <div className={theme ? "userListBlack col-7" : "userList col-7"}>
              <ButtonToolbar>
                <a
                  className="btn btn-outline-primary disabled"
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
                      var a = entities;
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
                      var a = entities;
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
                  <label className="switch">
                    <input
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
                  <h4>Found {total}</h4>
                </div>
              </ButtonToolbar>
              <div className="collapse" id="filter">
                <div className="card card-body">
                  <div className="row">
                    <b className=" col-3">Faculty</b>
                    <select
                      className="form-control col-9"
                      type="text"
                      // value={facVal}
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
                              {a["lastName"] ? (
                                <div>
                                  {a["lastName"] +
                                    " " +
                                    a["name"] +
                                    " " +
                                    a["middleName"] +
                                    " "}{" "}
                                  <b>{a["feedbackNum"]}</b>{" "}
                                </div>
                              ) : null}
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
                      <b className=" col-3">Mandatory Professions</b>
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
                        {professions
                          ? professions.map(a => (
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
            <div style={{ margin: "auto" }} className="col-4 userList">
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
            <h3>TEACHERS {response}</h3>
            <div className="list-group col-12">
              {entities
                ? entities.map(u => (
                    <div
                      style={{ cursor: "pointer", overflow: "hidden" }}
                      key={u[Object.keys(u)[0]] ? u[Object.keys(u)[0]] : "new"}
                      onClick={this.selectfaculty.bind(this.id)}
                      className="list-group-item list-group-item-action"
                      id={u[Object.keys(u)[0]]}
                    >
                      {u["lastName"] +
                        " " +
                        u["name"] +
                        " " +
                        u["middleName"] +
                        " "}{" "}
                      <b>{u["feedbackNumber"]}</b>
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
            {selectedTeacher ? (
              <div>
                <h2 style={{ overflow: "hidden" }}>
                  {selectedTeacher[Object.keys(selectedTeacher)[1]]}
                </h2>
                <div className="list-group">
                  <div className="list-group">
                    {Object.keys(this.state.selectedTeacher)
                      .slice(1)
                      .map(o =>
                        o === "feedbackNumber" ? (
                          <div key={o ? o : -1}>
                            <span>
                              {o.charAt(0).toUpperCase() + o.slice(1)}:
                            </span>
                            <div>
                              <div
                                type="text"
                                className="list-group-item list-group-item-action"
                              >
                                {this.state.selectedTeacher[o]}
                              </div>

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
                                  let sel = selectedTeacher;
                                  let b = query;
                                  sel[o] = e.target.value;
                                  b[o] = e.target.value;
                                  this.setState({
                                    selectedTeacher: sel,
                                    query: b
                                  });
                                }}
                                className="list-group-item list-group-item-action"
                                value={this.state.selectedTeacher[o]}
                              />

                              <hr />
                            </div>
                          </div>
                        )
                      )}
                  </div>
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
                </div>
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
                  !selectedTeacher["name"] ||
                  !selectedTeacher["lastName"] ||
                  !selectedTeacher["middleName"]
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

export default AdminTeacher;
