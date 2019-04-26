import React, { Component } from "react";
import "../../Styles/Admin.css";
import "bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { Link } from "react-router-dom";
import { MdEdit } from "react-icons/md";
import { Dropdown, DropdownButton, ButtonToolbar } from "react-bootstrap";
// import avatar from "../media/avatar.png";
class AdminFaculty extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      entities: [],
      page: 1,
      total: null,
      selectedFaculty: null,
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
    await this.setState({ selectedFaculty: entity, post: false });
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
          `${this.state.link}/admin/faculty/${
            this.state.selectedFaculty["id"]
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
                  `faculty '${this.state.selectedFaculty.name}' was ` +
                    JSON.stringify(data.statusText)
                )
              : alert(
                  `faculty ${
                    this.state.selectedFaculty.name
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

    fetch(`${this.state.link}/admin/faculty/${input ? query : ""}`, {
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
              entities: res["faculty"] ? res["faculty"] : FACULTIES,
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
      selectedFaculty: objCopy,
      entities: entitiesCopy,
      post: true
    });
  };
  putEntity = () => {
    const { link, selectedFaculty, query } = this.state;
    let body = query;
    console.log(
      "Fetched: ",
      `${link}/admin/faculty/${Number(selectedFaculty["id"])}`
    );

    window.confirm("Are you sure you want to update discipline?")
      ? fetch(`${link}/admin/faculty/${Number(selectedFaculty["id"])}`, {
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
      name: this.state.selectedFaculty["name"],
      shortName: this.state.selectedFaculty["shortName"]
    };

    fetch(`${this.state.link}/admin/faculty/`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(p => {
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
      selectedFaculty,
      faculties,
      response,
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
                              {a.name} ({a.shortName})
                            </option>
                          ))
                        : ""}
                    </select>
                  </div>
                  <hr />
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
            <h3>FACULTIES {response}</h3>
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
            {selectedFaculty ? (
              <div>
                <h2 style={{ overflow: "hidden" }}>
                  {selectedFaculty[Object.keys(selectedFaculty)[1]]}
                </h2>
                <div className="list-group">
                  <div>
                    <span>Name:</span>
                    <input
                      type="text"
                      onChange={e => {
                        const sel = selectedFaculty;
                        let temp = this.state.query;
                        temp["name"] = e.target.value;
                        sel["name"] = e.target.value;
                        this.setState({ selectedFaculty: sel, query: temp });
                      }}
                      className="list-group-item list-group-item-action"
                      value={selectedFaculty["name"]}
                    />
                  </div>

                  <div>
                    <span>Short Name:</span>
                    <input
                      type="text"
                      onChange={e => {
                        const sel = selectedFaculty;
                        sel["shortName"] = e.target.value;
                        let temp = this.state.query;
                        temp["shortName"] = e.target.value;
                        this.setState({ selectedFaculty: sel, query: temp });
                      }}
                      className="list-group-item list-group-item-action"
                      value={selectedFaculty["shortName"]}
                    />
                  </div>
                </div>
                <div>
                  {selectedFaculty["name"] ? (
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
                  !selectedFaculty["name"] || !selectedFaculty["shortName"]
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

export default AdminFaculty;
