import React, { Component } from "react";
// import PropTypes from "prop-types";
// import { withRouter } from "react-router";
class Discipline extends Component {
  //   static propTypes = {
  // match: PropTypes.object.isRequired,
  // location: PropTypes.object.isRequired,
  // history: PropTypes.object.isRequired
  //   };
  constructor(props) {
    super(props);
    this.state = {
      discipline: {}
    };
  }
  componentWillMount = () => {
    fetch(
      `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/discipline?id=${window.location.href.slice(
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
      .then(res => this.setState({ discipline: res.disciplines[0] }))
      .then(console.log(this.state))
      .catch(err => console.log(err));
  };
  render() {
    const { discipline } = this.state;
    console.log(discipline);

    return (
      <React.Fragment>
        <div>
          <h1>
            {discipline[Object.keys(discipline)[1]]} <small>name</small>{" "}
          </h1>
          <h2>
            {discipline[Object.keys(discipline)[2]]} <small>year</small>{" "}
          </h2>
          <h2>
            {discipline[Object.keys(discipline)[3]]} <small>faculty</small>{" "}
          </h2>
        </div>
      </React.Fragment>
    );
  }
}

export default Discipline;
