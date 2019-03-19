import React, { Component } from "react";
import "../Styles/Home.css";
import { Link } from "react-router-dom";
import "bootstrap";
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
      disciplines: [],
      entities: ["disciplines", "professions", "faculties", "teachers"],
      selected: "disciplines",
      total: 0
      // [
      //   { id: 1, name: "OOP", year: 2, faculty_id: 1 },
      //   { id: 2, name: "Procedure programming", year: 2, faculty_id: 1 },
      //   { id: 3, name: "OBDZ", year: 3, faculty_id: 1 },
      //   { id: 4, name: "Algorithms", year: 2, faculty_id: 1 },
      //   { id: 5, name: "English", year: 1, faculty_id: 2 },
      //   { id: 6, name: "English lit", year: 3, faculty_id: 2 },
      //   { id: 7, name: "Economics", year: 2, faculty_id: 777 },
      //   { id: 8, name: "History", year: 2, faculty_id: 777 }
      // ]
    };
  }

  componentDidMount = async () => {
    fetch(
      "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/discipline",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    )
      .then(res => res.json())
      .then(res =>
        this.setState({
          disciplines: res[this.state.selected],
          total: res.total
        })
      )
      .then(console.log(this.state))
      .catch(err => console.log(err));
  };
  search = input => {
    fetch(
      `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/${this.state.selected.slice(
        0,
        -1
      )}${input ? "?search=" + input : ""}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    )
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
  select = e => {
    this.setState({ selected: e });
    fetch(
      `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/${e.slice(
        0,
        -1
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    )
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
          <br />
          <ButtonToolbar>
            <DropdownButton
              variant="warning"
              id="dropdown-basic-button"
              title={this.state.selected}
            >
              {this.state.entities.map(e => (
                <Dropdown.Item key={e} onSelect={() => this.select(e)}>
                  {e}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            <DropdownButton id="dropdown-basic-button" title="Filters">
              <Dropdown.Item onClick={() => this.setState({})}>
                Action
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.setState({})}>
                Another action
              </Dropdown.Item>
              <Dropdown.Item onClick={() => this.setState({})}>
                Something else
              </Dropdown.Item>
            </DropdownButton>
          </ButtonToolbar>
          <b>Found {this.state.total}</b>

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
            >
              Search
            </Button>
          </div>
          <div className="list-group">
            <br />
            {this.state.disciplines
              ? this.state.disciplines.map(d => (
                  <Link
                    to={"/" + this.state.selected.slice(0, -1) + "/" + d.id}
                    className="list-group-item list-group-item-action"
                    id={d.id}
                    key={d.id}
                  >
                    {d.name}
                  </Link>
                ))
              : ""}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
