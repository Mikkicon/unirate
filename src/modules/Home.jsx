import React, { Component } from "react";
import "../Styles/Home.css";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import {
  Dropdown,
  DropdownButton,
  ButtonToolbar,
  Button
} from "react-bootstrap";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      disciplines: [],
      entities: ["discipline", "profession", "faculty", "teacher"],
      selected: "discipline",
      total: 0,
      query: { limit: 20, offset: 0 },
      faculties: [],
      placeholder: "",
      facVal: "",
      professions: "",
      theme: false,
      // loading: true,
      enableScroll: true
    };
  }

  componentDidMount = async () => {
    if (localStorage.getItem("admin").includes(true)) {
      window.location.href = "/admin-discipline";
    }

    this.search(this.state.query);
    this.getFacNames();
  };

  getFacNames = async () => {
    this.setState({ enableScroll: false, query: {} });
    const a = await fetch(`${this.state.link}/faculty`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    const b = await a.json();
    this.setState({ faculties: b.faculty });
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
          onClick={() => {
            const query = this.state.query;
            query.offset = (i - 1) * 10;
            console.log(query);

            this.setState({ query });
            this.search(query);
          }}
          key={i}
          id={i}
        >
          {i}
        </Pagination.Item>
      );
    }
    return array;
  };
  search = async input => {
    if (input.search) {
      await this.setState({ enableScroll: false, disciplines: [] });
    }
    var disciplines = this.state.disciplines;
    var query = Object.keys(input).reduce(
      (total, current) => total + current + "=" + input[current] + "&",
      ""
    );
    query = query ? "?" + query.slice(0, -1) : "";
    console.log("Search params:", query ? query : this.state.selected);

    fetch(`${this.state.link}/${this.state.selected}${input ? query : ""}`, {
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
              disciplines: res[this.state.selected]
                ? res[this.state.selected]
                : disciplines,
              total: res.total
            })
          : this.setState({ disciplines: [], total: 0 })
      )
      .catch(err => console.log(err));
  };
  select = async e => {
    await this.setState({ selected: e, disciplines: [] });
    this.search({});
  };

  getProfNames = async () => {
    this.setState({ enableScroll: false, query: {} });
    const a = await fetch(`${this.state.link}/profession`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    const b = await a.json();
    this.setState({ professions: b.profession });
  };
  loadfeedbackNumbers = () => {};
  render() {
    const { disciplines, total, query, theme } = this.state;
    return (
      <React.Fragment>
        <div
          className={theme ? "homeFormContDark col-10" : "homeFormCont col-10"}
        >
          <br />
          <ButtonToolbar>
            <DropdownButton
              variant="warning"
              id="dropdown-basic-button"
              title={this.state.selected.toUpperCase()}
            >
              {this.state.entities.map(e => (
                <Dropdown.Item key={e} onSelect={() => this.select(e)}>
                  {e}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            <a
              onClick={() => {
                this.getFacNames();
                this.getProfNames();
              }}
              className="btn btn-primary"
              data-toggle="collapse"
              href="#filter"
              role="button"
              aria-expanded="false"
            >
              FILTER
            </a>

            {/* <span>
              <a>
                <MdClose />
              </a>
            </span> */}

            <b />
            <DropdownButton
              variant="warning"
              id="dropdown-basic-button"
              title="SORT"
            >
              <Dropdown.Item
                onClick={() => {
                  this.search({ limit: 20, orderBy: "name" });
                }}
                key="a-asc"
              >
                Alphabet A->Z
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  this.search({ limit: 20, orderBy: "name DESC" });
                }}
                key="a-desc"
              >
                Alphabet Z->A
              </Dropdown.Item>
              {this.state.disciplines[0] ? (
                Object.keys(this.state.disciplines[0]).includes(
                  "feedbackNum"
                ) ? (
                  <div>
                    <Dropdown.Item
                      onClick={() => {
                        this.search({ limit: 20, orderBy: "feedbackNum" });
                      }}
                      key="f-asc"
                    >
                      Feedbacks 0->N
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => {
                        this.search({ limit: 20, orderBy: "feedbackNum DESC" });
                      }}
                      key="f-desc"
                    >
                      Feedbacks N->0
                    </Dropdown.Item>
                  </div>
                ) : (
                  ""
                )
              ) : (
                ""
              )}
            </DropdownButton>
            <div className="toolItem">
              {/* <small>infinite scroll</small> */}
              <label className="switch">
                <input
                  // checked={this.state.enableScroll}
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
                    const a = this.state.query;
                    a["facultyId"] = Number(p.target.value);
                    this.setState({ query: a });
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
                    const a = this.state.query;
                    if (p.target.value === "All") {
                      delete a["year"];
                    } else {
                      a["year"] = Number(p.target.value);
                    }
                    this.setState({ query: a });
                  }}
                >
                  <option>All</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>
              {this.state.selected === "discipline" ? (
                <div>
                  <hr />
                  <div className="row">
                    <b className=" col-3">mandatoryProfessionId</b>
                    <select
                      className="form-control col-9"
                      placeholder="mandatoryProfessionId"
                      onChange={p => {
                        const a = this.state.query;
                        if (p.target.value === "All") {
                          delete a["mandatoryProfessionId"];
                        } else {
                          a["mandatoryProfessionId"] = Number(p.target.value);
                        }
                        this.setState({ query: a });
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
              ) : (
                ""
              )}
            </div>
          </div>

          <br />

          {/* {this.state.loading ? <h2>Loading...</h2> : ""} */}
          <div className="row">
            <input
              className="form-control col-9"
              type="text"
              placeholder="Search"
              onChange={p => this.search({ search: p.target.value })}
            />
            <div className="col-1" />
            <Button
              style={{ margin: "auto 0" }}
              className=" btn-outline-success col-2"
              onClick={async () => {
                await this.setState({ disciplines: [] });
                this.search(this.state.query);
              }}
            >
              Search
            </Button>
          </div>
          <div className="list-group">
            <br />
            {this.state.disciplines
              ? this.state.disciplines.map(d => (
                  <div key={d.id}>
                    <div
                      className="list-group-item list-group-item-action progress-bar"
                      role="progressbar"
                      // aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      data-toggle="collapse"
                      href={"#col_" + d.id}
                      // aria-expanded="false"
                      aria-controls="collapseExample"
                    >
                      {d.name}{" "}
                      <b
                        style={{
                          float: "right"
                          // margin: "0 auto 0 auto"
                        }}
                      >
                        {d["feedbackNum"]
                          ? d["feedbackNum"]
                          : d["feedbackNum"] === 0
                          ? "0"
                          : ""}
                      </b>
                    </div>
                    <div className="collapse" id={"col_" + d.id}>
                      <div className="card card-body">
                        {Object.keys(d)
                          .filter(f => f !== "id" && f !== "login")
                          .map(key => (
                            <div key={key}>
                              {key === "facultyId" ? (
                                <div>
                                  {key}:{" "}
                                  {this.state.faculties.filter(
                                    a => a.id === d[key]
                                  )[0]
                                    ? this.state.faculties.filter(
                                        a => a.id === d[key]
                                      )[0].name
                                    : ""}{" "}
                                  <br />{" "}
                                </div>
                              ) : (
                                <div>
                                  {key}: {d[key]} <br />
                                </div>
                              )}
                            </div>
                          ))}
                        <Link
                          to={"/" + this.state.selected + "/" + d.id}
                          id={d.id}
                        >
                          More about "{d.name}"
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              : ""}

            <Pagination style={total < 10 ? { display: "none" } : {}}>
              <Pagination.First
                onClick={() => {
                  let a = query;
                  delete a["offset"];
                  this.search(a);
                }}
              />
              <Pagination.Prev
                disabled={disciplines ? !query["offset"] : true}
                onClick={() => {
                  let a = query;
                  a["offset"] -= 10;
                  this.search(a);
                }}
              />
              {this.pages()}
              <Pagination.Next
                disabled={
                  disciplines
                    ? query["offset"] &&
                      query["offset"] + query["limit"] >= total
                    : true
                }
                onClick={() => {
                  let a = query;
                  a["offset"] += 10;
                  this.search(a);
                }}
              />
              <Pagination.Last
                onClick={() => {
                  let a = query;
                  a["offset"] =
                    Math.floor(
                      query["limit"] && query["offset"]
                        ? total / query["limit"]
                        : 0
                    ) * 10;
                  this.search(a);
                }}
              />
            </Pagination>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Home;
