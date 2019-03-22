import React, { Component } from "react";
import "../Styles/Home.css";
import { Link } from "react-router-dom";
import "bootstrap";
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
      query: {}
    };
  }

  componentWillMount = async () => {
    this.search({});
  };
  search = input => {
    var query = Object.keys(input).reduce(
      (total, current) => total + current + "=" + input[current] + "&",
      ""
    );
    query = query ? "?" + query.slice(0, -1) : "";
    console.log(query);

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
              disciplines: res[this.state.selected],
              total: res.total
            })
          : this.setState({ disciplines: [], total: 0 })
      )
      .catch(err => console.log(err));
  };
  select = e => {
    this.setState({ selected: e });
    fetch(`${this.state.link}/${e}`, {
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
              disciplines: res[this.state.selected],
              total: res.total
            })
          : this.setState({ disciplines: [], total: 0 })
      )
      .then(console.log(this.state))
      .catch(err => console.log(err));
  };
  pages = () => {
    let array = [];
    for (
        let i = 1;
        i <
        Math.floor(this.state.entities ? this.state.entities.length / 20 : 0) + 2;
        i++
    ) {
        array.push(<Pagination.Item key={i}> {i}</Pagination.Item>);
    }
    return array;
    };
  render() {
    return (
      <React.Fragment>
        <div className="homeFormCont col-10">
          <Link className="btn btn-outline-primary" to="/">
            Home
          </Link>
          <Link className="btn btn-outline-primary" to="/register">
            Registration
          </Link>
          <Link className="btn btn-outline-primary" to="/login">
            Login
          </Link>
          <Link className="btn btn-outline-primary" to="/settings">
            Settings
          </Link>
          <Link className="btn btn-outline-primary" to="/admin">
            Admin
          </Link>
            <Button className="btn-outline-danger" onClick={this.logout}>Logout</Button>
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
              className="btn btn-primary"
              data-toggle="collapse"
              href="#collapseExample"
              role="button"
              aria-expanded="false"
            >
              FILTER
            </a>
            <div style={{ margin: "20px" }}>
              <h4>Found {this.state.total}</h4>
            </div>
            <b />
          </ButtonToolbar>
          <div className="collapse" id="collapseExample">
            <div className="card card-body">
              <div className="row">
                <b className=" col-3">Faculty</b>
                <input
                  className="form-control col-9"
                  type="text"
                  placeholder="Faculty"
                  onChange={p => {
                    const a = this.state.query;
                    a["facultyId"] = p.target.value;
                    this.setState({ query: a });
                  }}
                />
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
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>
            </div>
          </div>
          <br />

          <div className="row">
            <input
              className="form-control col-9"
              type="text"
              placeholder="Search"
              onChange={p => this.search(p.target.value)}
            />
            <div className="col-1" />
            <Button
              style={{ margin: "auto 0" }}
              className=" btn-outline-success col-2"
              onClick={() => this.search(this.state.query)}
            >
              Search
            </Button>
          </div>
          <div className="list-group">
            <br />
            {this.state.disciplines
              ? this.state.disciplines.map(d => (
                  <Link
                    to={"/" + this.state.selected + "/" + d.id}
                    className="list-group-item list-group-item-action"
                    id={d.id}
                    key={d.id}
                  >
                    {d.name}
                  </Link>
                ))
              : ""}

            <Pagination>
              <Pagination.First />
              <Pagination.Prev
                  disabled={this.state.entities ? this.state.page < 2 : true}
              />
              {this.pages()}
              <Pagination.Next />
              <Pagination.Last />
            </Pagination>

          </div>

        </div>

      </React.Fragment>
    );
  }
logout()
{
    localStorage.clear();
    window.location.href = '/';
}
}
export default Home;
