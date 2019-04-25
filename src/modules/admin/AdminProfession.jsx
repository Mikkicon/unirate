import React, { Component } from "react";
import "../../Styles/Admin.css";
import "bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { Dropdown, DropdownButton, ButtonToolbar } from "react-bootstrap";
// import avatar from "../media/avatar.png";
class AdminProfession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      entities: [],
      page: 1,
      total: null,
      selectedProfession: null,
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
  selectprofession = async p => {
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
    await this.setState({ selectedProfession: entity, post: false });
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
          `${this.state.link}/admin/profession/${
            this.state.selectedProfession["id"]
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
                  `profession '${this.state.selectedProfession.name}' was ` +
                    JSON.stringify(data.statusText)
                )
              : alert(
                  `profession ${
                    this.state.selectedProfession.name
                  } has been successfully deleted`
                )
          )
          .catch(err => console.log(err))
      : console.log("You've decided not to delete profession.:)");

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
    console.log("Search params:", query ? query : "profession");

    fetch(`${this.state.link}/admin/profession/${input ? query : ""}`, {
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
              entities: res["profession"] ? res["profession"] : FACULTIES,
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
      selectedProfession: objCopy,
      entities: entitiesCopy,
      post: true
    });
  };
  putEntity = () => {
    const { link, selectedProfession, query } = this.state;
    let body = query;

    window.confirm("Are you sure you want to update discipline?")
      ? fetch(`${link}/admin/profession/${Number(selectedProfession["id"])}`, {
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
    let body = {
      name: this.state.selectedProfession["name"],
      facultyId: this.state.selectedProfession["facultyId"]
    };

    fetch(`${this.state.link}/admin/profession/`, {
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
  };
  render() {
    const {
      entities,
      page,
      total,
      selectedProfession,
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
                    <b className=" col-3">profession</b>
                    <select
                      className="form-control col-9"
                      type="text"
                      // value={facVal}
                      placeholder="profession Name"
                      onChange={p => {
                        const a = query;
                        a["professionId"] = Number(p.target.value);
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
              <Link className="btn btn-outline-info" to="/admin-profession">
                FACULTIES
              </Link>
              <Link className="btn btn-outline-info" to="/admin-profession">
                PROFESSIONS
              </Link>
            </div>
          </div>
          <div className=" row userList col-6">
            <h3>PROFESSIONS {response}</h3>
            <div className="list-group col-12">
              {entities
                ? entities.map(u => (
                    <div
                      style={{ cursor: "pointer", overflow: "hidden" }}
                      key={u[Object.keys(u)[0]] ? u[Object.keys(u)[0]] : "new"}
                      onClick={this.selectprofession.bind(this.id)}
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
            {selectedProfession ? (
              <div>
                <h2>
                  {
                    this.state.selectedProfession[
                      Object.keys(this.state.selectedProfession)[1]
                    ]
                  }
                </h2>
                <div className="list-group">
                  <div>
                    <span>Name:</span>
                    <div>
                      <input
                        type="text"
                        onChange={e => {
                          let sel = selectedProfession;
                          let b = query;
                          sel["name"] = e.target.value;
                          b["name"] = e.target.value;
                          this.setState({ selectedProfession: sel, query: b });
                        }}
                        className="list-group-item list-group-item-action"
                        value={this.state.selectedProfession["name"]}
                      />

                      <hr />
                    </div>
                  </div>
                  <div>
                    <span>Faculty:</span>
                    <select
                      className="list-group-item list-group-item-action form-control"
                      type="text"
                      onChange={p => {
                        let a = selectedProfession;
                        let b = query;
                        a["facultyId"] = Number(p.target.value);
                        b["facultyId"] = Number(p.target.value);
                        this.setState({ selectedProfession: a, query: b });
                      }}
                    >
                      {faculties
                        ? selectedProfession["id"]
                          ? faculties.map(a => (
                              <option
                                key={a.id}
                                value={a.id}
                                selected={
                                  a.id === selectedProfession["facultyId"]
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
                  !selectedProfession["name"] ||
                  !selectedProfession["facultyId"]
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

export default AdminProfession;
