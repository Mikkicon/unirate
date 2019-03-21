import React, { Component } from "react";
// import PropTypes from "prop-types";
// import { withRouter } from "react-router";
class Faculty extends Component {
  //   static propTypes = {
  // match: PropTypes.object.isRequired,
  // location: PropTypes.object.isRequired,
  // history: PropTypes.object.isRequired
  //   };
  constructor(props) {
    super(props);
    this.state = {
      faculty: {}
    };
  }
  componentWillMount = () => {
    fetch(
      `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/faculty?id=${window.location.href.substr(
        window.location.href.indexOf("faculty") + 8,
        window.location.href.length
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
      .then(res => this.setState({ faculty: res.faculty[0] }))
      .then(console.log(this.state))
      .catch(err => console.log(err));
  };
  render() {
    const { faculty } = this.state;
    console.log(faculty);

    return (
      <React.Fragment>
        <div>
          <h1>
            {faculty[Object.keys(faculty)[1]]} <small>name</small>{" "}
          </h1>
          <h2>
            {faculty[Object.keys(faculty)[2]]} <small>shortName</small>{" "}
          </h2>
        </div>
      </React.Fragment>
    );
  }
}

export default Faculty;
