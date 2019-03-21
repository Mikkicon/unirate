import React, { Component } from "react";
class Discipline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      discipline: {}
    };
  }
  componentWillMount = () => {
    fetch(
      `${this.state.link}/discipline?id=${window.location.href.substr(
        window.location.href.indexOf("discipline") + 11,
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
      .then(res => this.setState({ discipline: res.discipline[0] }))
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
