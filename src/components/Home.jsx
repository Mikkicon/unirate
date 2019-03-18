import React, { Component } from "react";
import "../Styles/Home.css";
import { Link } from "react-router-dom";
import "bootstrap";
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disciplines: [
        { id: 1, name: "OOP", year: 2, faculty_id: 1 },
        { id: 2, name: "Procedure programming", year: 2, faculty_id: 1 },
        { id: 3, name: "OBDZ", year: 3, faculty_id: 1 },
        { id: 4, name: "Algorithms", year: 2, faculty_id: 1 },
        { id: 5, name: "English", year: 1, faculty_id: 2 },
        { id: 6, name: "English lit", year: 3, faculty_id: 2 },
        { id: 7, name: "Economics", year: 2, faculty_id: 777 },
        { id: 8, name: "History", year: 2, faculty_id: 777 }
      ]
    };
  }

  componentDidMount() {}
  search = input => {
    console.log(input);
    fetch(
      "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/discipline"
    )
      .then(res => console.log(res))
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
          <h1>UNIRATE</h1>
          <div className="list-group">
            <input
              className="form-control"
              type="text"
              placeholder="Search"
              onChange={p => this.search(p.target.value)}
            />
            {this.state.disciplines.map(d => (
              <div
                // onClick={this.selectUser.bind(this.id)}
                className="list-group-item list-group-item-action"
                id={d.id}
                key={d.id}
              >
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Home;
