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
    return (
      <React.Fragment>
        <div>
          {discipline
            ? Object.keys(discipline).map(val => (
                <div key={val}>{discipline[val]}</div>
              ))
            : ""}
          {window.location.href.slice(-1)}
        </div>
      </React.Fragment>
    );
  }
}

export default Discipline;
