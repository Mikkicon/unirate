import React, { Component } from "react";
import "../Styles/Print.css";
class Print extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      entities: [],
      current: window.location.href.substr(
        window.location.href.indexOf("reports") + 8,
        window.location.href.length
      )
    };
  }
  componentDidMount() {
    fetch(
      `${this.state.link}/admin/${window.location.href.substr(
        window.location.href.indexOf("reports") + 8,
        window.location.href.length
      )}?limit=1000`,
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
          entities: res.total ? res[this.state.current] : []
        })
      )
      .then(console.log(this.state))
      .catch(err => console.log(err));
  }
  render() {
    return (
      <React.Fragment>
        <div className="homeFormCont div col-10">
          <h2>{this.state.current.toUpperCase()} REPORT</h2>
          <br />
          <table>
            <thead>
              <tr>
                {this.state.entities[0]
                  ? Object.keys(this.state.entities[0]).map(key => (
                      <th key={key}>{key.toUpperCase()}</th>
                    ))
                  : ""}
              </tr>
            </thead>
            <tbody>
              {this.state.entities
                ? this.state.entities.map(entity => (
                    <tr key={entity[Object.keys(entity)[0]]}>
                      {Object.keys(entity).map(key => (
                        <td key={key}>{entity[key]}</td>
                      ))}
                    </tr>
                  ))
                : ""}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    );
  }
}

export default Print;
