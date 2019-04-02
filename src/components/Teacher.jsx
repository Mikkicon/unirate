import React, { Component } from "react";
// import PropTypes from "prop-types";
// import { withRouter } from "react-router";
class Teacher extends Component {
  //   static propTypes = {
  // match: PropTypes.object.isRequired,
  // location: PropTypes.object.isRequired,
  // history: PropTypes.object.isRequired
  //   };
  constructor(props) {
    super(props);
    this.state = {
      teacher: {}
    };
  }
  componentDidMount = () => {
    fetch(
      `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/teacher?teacherId=${window.location.href.substr(
        window.location.href.indexOf("teacher") + 8,
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
      .then(res => this.setState({ teacher: res.teacher[0] }))
      .then(console.log(this.state))
      .catch(err => console.log(err));
  };
  render() {
    const { teacher } = this.state;
    console.log(teacher);

    return (
      <React.Fragment>
        <div>
          <h1>
            <small>Last Name</small> {teacher[Object.keys(teacher)[1]]}
          </h1>
          <h1>
            <small>First Name</small> {teacher[Object.keys(teacher)[2]]}
          </h1>
          <h1>
            <small>Middle name</small> {teacher[Object.keys(teacher)[3]]}
          </h1>
          <h1>
            <small>Feedback number</small> {teacher[Object.keys(teacher)[4]]}
          </h1>
        </div>
      </React.Fragment>
    );
  }
}

export default Teacher;
