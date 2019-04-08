import React, { Component } from "react";
// import PropTypes from "prop-types";
// import { withRouter } from "react-router";
class Profession extends Component {
  //   static propTypes = {
  // match: PropTypes.object.isRequired,
  // location: PropTypes.object.isRequired,
  // history: PropTypes.object.isRequired
  //   };
  constructor(props) {
    super(props);
    this.state = {
      profession: {}
    };
  }
  componentDidMount = () => {
    fetch(
      `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/profession?professionId=${window.location.href.substr(
        window.location.href.indexOf("profession") + 11,
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
      .then(res => this.setState({ profession: res.profession[0] }))
      .then(console.log(this.state))
      .catch(err => console.log(err));
  };
  render() {
    const { profession } = this.state;
    console.log(profession);

    return (
      <React.Fragment>
        <div>
          <h1>
            {profession[Object.keys(profession)[1]]} <small>name</small>{" "}
          </h1>
          <h2>
            {profession[Object.keys(profession)[2]]} <small>faculty</small>{" "}
          </h2>
        </div>
      </React.Fragment>
    );
  }
}

export default Profession;
