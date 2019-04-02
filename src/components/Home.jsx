import React, { Component } from "react";
import "../Styles/Home.css";
import { Link } from "react-router-dom";
import "bootstrap";
// import { MdClose } from "react-icons/md";
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
      // loading: true,
      disableScroll: false
    };
    window.onscroll = async () => {
      const {
        search,
        state: { disableScroll }
      } = this;
      if (disableScroll) {
        console.log("scrolled");
        this.setState({ query: {} });
        return;
      } else if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        await this.setState({
          query: {
            offset: !isNaN(this.state.query.offset)
              ? this.state.query.offset + 20
              : 0
          }
        });
        search(this.state.query);
      }
    };
  }

  componentDidMount = async () => {
    this.search(this.state.query);
  };
  search = async input => {
    if (input.search) {
      await this.setState({ disableScroll: true, disciplines: [] });
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
                ? disciplines.concat(res[this.state.selected])
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
  getFacNames = async () => {
    this.setState({ disableScroll: true });
    const a = await fetch(`${this.state.link}/faculty`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    const b = await a.json();
    this.setState({ faculties: b.faculty });
  };
  // pages = () => {
  //   let array = [];
  //   for (
  //     let i = 1;
  //     i <
  //     Math.floor(this.state.entities ? this.state.entities.length / 20 : 0) + 2;
  //     i++
  //   ) {
  //     array.push(<Pagination.Item key={i}> {i}</Pagination.Item>);
  //   }
  //   return array;
  // };
  render() {
    return (
      <React.Fragment>
        <div className="homeFormCont col-10">
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
              onClick={() => this.getFacNames()}
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
                  var a = this.state.disciplines;
                  a = a.sort((a, b) => (a.name > b.name ? 1 : -1));
                  this.setState({ disciplines: a });
                }}
                key="a-asc"
              >
                Alphabet A->Z
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  var a = this.state.disciplines;
                  a = a.sort((a, b) => (a.name < b.name ? 1 : -1));
                  this.setState({ disciplines: a });
                }}
                key="a-desc"
              >
                Alphabet A->Z
              </Dropdown.Item>

              <Dropdown.Item key="n-desc">Rating \/</Dropdown.Item>
              <Dropdown.Item key="n-asc">Rating /\</Dropdown.Item>
            </DropdownButton>
            <div className="toolItem">
              <label className="switch">
                <input
                  type="checkbox"
                  onChange={p => console.log(p.target.checked)}
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
                    a["year"] = Number(p.target.value);
                    this.setState({ query: a });
                  }}
                >
                  <option>Choose</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>
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
                      {d.name}
                    </div>
                    <div className="collapse" id={"col_" + d.id}>
                      <div className="card card-body">
                        Year: {d.year} <br />
                        Faculty: {d.facultyId}
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

            {/* <Pagination>
              <Pagination.First />
              <Pagination.Prev
                disabled={this.state.entities ? this.state.page < 2 : true}
              />
              {this.pages()}
              <Pagination.Next />
              <Pagination.Last />
            </Pagination> */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
export default Home;
