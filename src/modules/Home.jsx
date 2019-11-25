import React, { Component } from "react";
import "../Styles/Home.css";
import { Link } from "react-router-dom";
import Pagination from "react-bootstrap/Pagination";
import Filter from "./Filter";
import Toolbar from "./Toolbar";
import { Button } from "react-bootstrap";
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
    this.search(this.state.query);
    this.getFacNames();
  };

  getFacNames = async () => {
    this.setState({ enableScroll: false, query: {} });
    fetch(`${this.state.link}/faculty`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(a => a.json())
      .then(b => this.setState({ faculties: b.faculty }));
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
            this.setState(
              state => ({
                query: { ...state.query, offset: (i - 1) * 10 }
              }),
              () => this.search(this.state.query)
            );
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
    this.setState({ selected: e, disciplines: [] }, () => this.search({}));
  };
  setTheme = a => {
    this.setState({ theme: a });
  };
  render() {
    const {
      selected,
      disciplines,
      total,
      faculties,
      query,
      link,
      theme,
      entities
    } = this.state;
    return (
      <React.Fragment>
        <div
          className={theme ? "homeFormContDark col-10" : "homeFormCont col-10"}
        >
          <br />
          <Toolbar
            selectedEntity={selected}
            theme={theme}
            select={this.select}
            search={this.search}
            entities={entities}
            setTheme={this.setTheme}
            total={total}
          />
          {selected === "discipline" ? (
            <Filter
              link={link}
              search={this.search}
              faculties={faculties}
              options={["faculty", "year", "mandatoryProfessionId"]}
            />
          ) : selected === "profession" ? (
            <Filter search={this.search} options={["faculty"]} />
          ) : (
            <Filter search={this.search} options={[]} />
          )}

          <br />
          <div className="row">
            <input
              className={
                theme ? "search form-control col-9" : "form-control col-9"
              }
              type="text"
              placeholder="Search"
              onChange={p => this.search({ search: p.target.value })}
            />
            {/* <div className="col-1" /> */}
            <Button
              className=" btnStyle btn-outline-success col-2"
              onClick={() => {
                this.setState({ disciplines: [] }, () =>
                  this.search(this.state.query)
                );
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
                      className={
                        theme
                          ? "list-group-item list-group-item-primary list-group-item-action progress-bar"
                          : "list-group-item list-group-item-action progress-bar"
                      }
                      data-toggle="collapse"
                      href={"#col_" + d.id}
                      aria-controls="collapseExample"
                    >
                      {d.name}{" "}
                      <b
                        style={{
                          float: "right"
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
                      <div
                        className={
                          theme ? "dark-card card card-body" : "card card-body"
                        }
                      >
                        {Object.keys(d)
                          .filter(f => f !== "id" && f !== "login")
                          .map(key => (
                            <div key={key}>
                              <div>
                                <b>{key.toUpperCase()} </b> : {d[key]} {"     "}
                              </div>
                            </div>
                          ))}
                        <Link
                          to={"/" + this.state.selected + "/" + d.id}
                          id={d.id}
                          className="btn btn-outline-info"
                        >
                          More about "{d.name}"
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              : ""}

            <Pagination
              style={total < 10 ? { display: "none" } : {}}
              className={theme ? "" : ""}
            >
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
