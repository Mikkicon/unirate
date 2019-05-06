import React, { Component } from "react";
import "../../Styles/Admin.css";
import "bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { MdEdit } from "react-icons/md";
import Filter from "../Filter";
import Toolbar from "../Toolbar";
import AdminMenu from "../AdminMenu";
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
      query: null,
      theme: false
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
    const { link, selectedDiscipline, query } = this.state;
    let body = JSON.stringify(query);
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
        ).catch(err => console.log(err))
      : console.log("You've decided not to delete discipline.:)");

    this.search("");
  };
  search = input => {
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
  setTheme = a => {
    this.setState({ theme: a });
  };
  render() {
    const {
      entities,
      page,
      total,
      selectedDiscipline,
      faculties,
      response,
      query,
      theme,
      link
    } = this.state;

    return (
      <React.Fragment>
        <div style={{ margin: "auto" }} className="col-11 row">
          <div className="row">
            <br />
            <br />
            <div className={theme ? "userListBlack col-6" : "userList col-6"}>
              <Toolbar
                selected="discipline"
                theme={theme}
                select={null}
                search={this.search}
                entities={entities}
                setTheme={this.setTheme}
                total={total}
              />
              {/* className={
                    theme ? "dark-card card card-body" : "card card-body"
                  } */}

              <Filter
                link={link}
                admin={true}
                search={this.search}
                theme={theme}
                options={["faculty", "year", "mandatoryProfessionId"]}
              />
            </div>
            <AdminMenu theme={theme} />
          </div>
          <div
            className={
              theme ? "row userListBlack col-6" : " row col-6 userList"
            }
          >
            <h3>DISCIPLINES {response}</h3>
            <div className="list-group col-12">
              {entities
                ? entities.map(u => (
                    <div
                      style={{ cursor: "pointer" }}
                      key={u[Object.keys(u)[0]] ? u[Object.keys(u)[0]] : "new"}
                      onClick={this.selectDiscipline.bind(this.id)}
                      className={
                        theme
                          ? "list-group-item list-group-item-primary list-group-item-action progress-bar"
                          : "list-group-item list-group-item-action progress-bar"
                      }
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

          <div className={theme ? "userViewBlack col-5" : "col-5 userView"}>
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
                      className={
                        theme
                          ? "search list-group-item list-group-item-action"
                          : "list-group-item list-group-item-action"
                      }
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
                      className={
                        theme
                          ? "search list-group-item list-group-item-action form-control"
                          : "list-group-item list-group-item-action form-control"
                      }
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
                      className={
                        theme
                          ? "search list-group-item list-group-item-action form-control"
                          : "list-group-item list-group-item-action form-control"
                      }
                      type="text"
                      onChange={p => {
                        var a = selectedDiscipline;
                        a["facultyId"] = Number(p.target.value);
                        var query1 = query;
                        query1["facultyId"] = Number(p.target.value);
                        this.setState({ selectedDiscipline: a, query: query1 });
                      }}
                    >
                      {faculties
                        ? selectedDiscipline["id"]
                          ? faculties.map(a => (
                              <option
                                key={a.id}
                                value={a.id}
                                selected={
                                  a.name === selectedDiscipline["facultyName"]
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
