import React, { Component } from "react";
import "../../Styles/Home.css";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import {
  Dropdown,
  DropdownButton,
  ButtonToolbar,
  Button
} from "react-bootstrap";
class Homefaculties extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      faculties: [],
      total: 0,
      token: localStorage.getItem("token"),
      query: { limit: 10, offset: 0 },
      faculty: [],
      placeholder: null,
      facVal: null,
      profession: null,
      enableScroll: true
    };
  }

  componentDidMount = async () => {
    this.search(this.state.query);
    this.getNames("faculty");
    this.getNames("profession");
  };
  getNames = name => {
    fetch(`${this.state.link}/${name}`, {
      headers: {
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(raw => raw.json())
      .then(data =>
        name === "faculty"
          ? this.setState({ faculty: data[name] })
          : this.setState({ profession: data[name] })
      );
  };
  pages = () => {
    let array = [];
    for (
      let i = 1;
      i < Math.floor(this.state.faculties ? this.state.total / 10 : 0) + 2;
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
    var faculties = this.state.faculties;
    var query = Object.keys(input).reduce(
      (total, current) => total + current + "=" + input[current] + "&",
      ""
    );
    query = query ? "?" + query.slice(0, -1) : null;
    console.log("Search params:", query ? query : "faculty");

    fetch(`${this.state.link}/faculty${input ? query : ""}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + this.state.token
      }
    })
      .then(res => res.json())
      .then(res =>
        res.total
          ? this.setState({
              faculties: res["faculty"] ? res["faculty"] : faculties,
              total: res.total
            })
          : this.setState({ faculties: [], total: 0 })
      )
      .catch(err => console.log(err));
  };
  render() {
    const {
      faculties,
      total,
      query,
      faculty,
      profession,
      enableScroll
    } = this.state;
    return (
      <React.Fragment>
        <div className="homeFormCont col-10">
          <br />
          <ButtonToolbar>
            <DropdownButton
              variant="warning"
              id="dropdown-basic-button"
              title="faculty"
            >
              <Dropdown.Item
                onSelect={() =>
                  (window.location.href = "/home/home-disciplines")
                }
              >
                disciplines
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() =>
                  (window.location.href = "/home/home-professions")
                }
              >
                profession
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() => (window.location.href = "/home/home-faculties")}
              >
                faculties
              </Dropdown.Item>
              <Dropdown.Item
                onSelect={() => (window.location.href = "/home/home-teachers")}
              >
                teachers
              </Dropdown.Item>
            </DropdownButton>

            <a
              className="btn btn-primary"
              data-toggle="collapse"
              href="#filter"
              role="button"
              aria-expanded="false"
            >
              FILTER
            </a>
            <b />
            <DropdownButton
              variant="warning"
              id="dropdown-basic-button"
              title="SORT"
            >
              <Dropdown.Item
                onClick={() => {
                  var a = faculties;
                  a = a.sort((a, b) => (a.name > b.name ? 1 : -1));
                  this.setState({ faculties: a });
                }}
                key="a-asc"
              >
                Alphabet A->Z
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  var a = faculties;
                  a = a.sort((a, b) => (a.name < b.name ? 1 : -1));
                  this.setState({ faculties: a });
                }}
                key="a-desc"
              >
                Alphabet A->Z
              </Dropdown.Item>
            </DropdownButton>
            <div className="toolItem">
              <label className="switch">
                <input
                  checked={enableScroll}
                  type="checkbox"
                  onChange={p =>
                    this.setState({ enableScroll: p.target.checked })
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
                    p.target.value === "All"
                      ? delete a["facultyId"]
                      : (a["facultyId"] = Number(p.target.value));

                    this.setState({ query: a });
                  }}
                >
                  <option value="All">All</option>
                  {faculty
                    ? faculty.map(a => (
                        <option key={a["id"]} value={a["id"]}>
                          {a.name} ({a.shortName})
                        </option>
                      ))
                    : null}
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
                  }}
                >
                  <option>All</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>
              {
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
                      }}
                    >
                      <option>All</option>
                      {profession
                        ? profession.map(a => (
                            <option key={a["id"]} value={a["id"]}>
                              {a["name"]}
                            </option>
                          ))
                        : null}
                    </select>
                  </div>
                </div>
              }
            </div>
          </div>

          <br />

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
                await this.setState({ faculties: [] });
                this.search(query);
              }}
            >
              Search
            </Button>
          </div>
          <div className="list-group">
            <br />
            {faculties
              ? faculties.map(d => (
                  <div key={d["id"]}>
                    <div
                      className="list-group-item list-group-item-action progress-bar"
                      role="progressbar"
                      // aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      data-toggle="collapse"
                      href={"#col_" + d["id"]}
                      // aria-expanded="false"
                      aria-controls="collapseExample"
                    >
                      {d.name}
                    </div>
                    <div className="collapse" id={"col_" + d["id"]}>
                      <div className="card card-body">
                        Name: {d["name"]} <br />
                        Year: {d["year"]} <br />
                        <div>
                          FACULTY:
                          {faculty.filter(a => a["id"] == d["key"])[0]
                            ? faculty.filter(a => a["id"] == d["key"])[0].name
                            : d["facultyId"]}
                          <br />
                        </div>
                        <Link to={"/faculty/" + d["id"]}>
                          More about "{d.name}"
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              : null}

            <Pagination style={total < 10 ? { display: "none" } : {}}>
              <Pagination.First
                onClick={() => {
                  let a = query;
                  delete a["offset"];
                  this.search(a);
                }}
              />
              <Pagination.Prev
                disabled={faculties ? !query["offset"] : true}
                onClick={() => {
                  let a = query;
                  a["offset"] -= 10;
                  this.search(a);
                }}
              />
              {this.pages()}
              <Pagination.Next
                disabled={
                  faculties ? query["offset"] + query["limit"] >= total : true
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
                    Math.floor(query["limit"] ? total / query["limit"] : 0) *
                    10;
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
export default Homefaculties;
