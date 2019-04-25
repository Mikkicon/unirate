import React, { Component } from "react";
import "../../Styles/Admin.css";
import "bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { Dropdown, DropdownButton, ButtonToolbar } from "react-bootstrap";
import Time from "react-time";

// import avatar from "../media/avatar.png";
class AdminFeedback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      entities: [],
      page: 1,
      total: null,
      selectedFeedback: null,
      post: false,
      newEntity: null,
      faculties: null,
      professions: null,
      disciplines: null,
      teachers: null,
      response: null,
      query: null,
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
    fetch(`${this.state.link}/admin/discipline`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => this.setState({ disciplines: data.discipline }));
    fetch(`${this.state.link}/admin/teacher`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => this.setState({ teachers: data.teacher }));
  };
  selectFeedback = async p => {
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
    await this.setState({ selectedFeedback: entity, post: false });
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
          `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/admin/feedback/${
            this.state.selectedFeedback[
              Object.keys(this.state.selectedFeedback)[0]
            ]
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
                  `feedback '${this.state.selectedFeedback.name}' was ` +
                    JSON.stringify(data.statusText)
                )
              : alert(
                  `feedback ${
                    this.state.selectedFeedback.name
                  } has been successfully deleted`
                )
          )
          .catch(err => console.log(err))
      : console.log("You've decided not to delete feedback.:)");

    this.search("");
  };
  search = async input => {
    if (input.search) {
      await this.setState({ entities: [] });
    }
    var feedbacks = this.state.entities;
    var query = Object.keys(input).reduce(
      (total, current) => total + current + "=" + input[current] + "&",
      ""
    );
    query = query ? "?" + query.slice(0, -1) : "";
    console.log("Search params:", query ? query : "feedback");

    fetch(`${this.state.link}/admin/feedback/${input ? query : ""}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(res =>
        res.total
          ? this.setState({
              entities: res["feedback"] ? res["feedback"] : feedbacks,
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
      selectedFeedback,
      faculties,
      response,
      professions,
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
            <h3>FEEDBACKS {response}</h3>
            <div className="list-group col-12">
              {entities
                ? entities.map(u => (
                    <div
                      style={{ cursor: "pointer" }}
                      key={u[Object.keys(u)[0]] ? u[Object.keys(u)[0]] : "new"}
                      onClick={this.selectFeedback.bind(this.id)}
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
            {selectedFeedback ? (
              <div>
                <h2>{selectedFeedback[Object.keys(selectedFeedback)[1]]}</h2>
                <div className="list-group">
                  {Object.keys(selectedFeedback)
                    .filter(
                      f =>
                        !f.includes("id") &&
                        !f.includes("Id") &&
                        !f.includes("created")
                    )
                    .map(o => (
                      <div key={o ? o : -1}>
                        <span>{o.charAt(0).toUpperCase() + o.slice(1)}:</span>
                        <div>
                          <div className="list-group-item list-group-item-action">
                            {typeof selectedFeedback[o] === "object"
                              ? selectedFeedback[o]
                                ? selectedFeedback[o].map(kkk => (
                                    <div>
                                      {Object.keys(kkk)
                                        .filter(
                                          f =>
                                            !f.includes("id") &&
                                            !f.includes("Id")
                                        )
                                        .map(k => (
                                          <div key={k}>
                                            {k}: {kkk[k]}
                                          </div>
                                        ))}
                                      <hr />
                                    </div>
                                  ))
                                : ""
                              : selectedFeedback[o]}
                          </div>
                          <hr />
                        </div>
                      </div>
                    ))}
                  <div>
                    <span>Created:</span>
                    <div>
                      <div className="list-group-item list-group-item-action">
                        {
                          <div>
                            {
                              <Time
                                value={
                                  Number(selectedFeedback["created"]) * 1000
                                }
                                format="HH:mm DD/MM/YYYY"
                              />
                            }
                          </div>
                        }
                      </div>
                      <hr />
                    </div>
                  </div>

                  <div>
                    <span>Discipline name :</span>
                    <div>
                      <div className="list-group-item list-group-item-action">
                        {selectedFeedback["disciplineName"]}
                      </div>
                      <hr />
                    </div>
                  </div>
                </div>
                <div>
                  <button
                    onClick={this.deleteEntity}
                    className="btn btn-outline-danger"
                  >
                    DELETE
                  </button>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default AdminFeedback;
