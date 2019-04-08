import React, { Component } from "react";
class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      entities: [],
      feedback: null,
      feedbacks: null
    };
  }
  componentDidMount() {
    fetch(
      `${this.state.link}/admin/statistics/${window.location.href.substr(
        window.location.href.indexOf("statistics") + 11,
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
      .then(res =>
        this.setState({
          entities: res.total ? res[Object.keys(res)[1]] : []
        })
      )
      .then(console.log(this.state))
      .catch(err => console.log(err));
  }
  render() {
    return (
      <React.Fragment>
        <div className="homeFormCont col-10">
          {this.state.entities[0]
            ? this.state.entities.map(d => (
                <div key={d.id ? d.id : d.login}>
                  <div
                    className="list-group-item list-group-item-action progress-bar"
                    role="progressbar"
                    // aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    data-toggle="collapse"
                    href={"#col_" + (d.id ? d.id : d.login)}
                    // aria-expanded="false"
                    aria-controls="collapseExample"
                  >
                    {d["lastName"]
                      ? d["lastName"] + " " + d["name"] + " " + d["middleName"]
                      : d["name"]
                      ? d["name"]
                      : Object.values(d).join(" ")}
                  </div>
                  <div
                    className="collapse"
                    id={"col_" + (d.id ? d.id : d.login)}
                  >
                    <div className="card card-body">
                      {Object.keys(d)
                        .filter(f => f !== "id" && f !== "login")
                        .map(key => (
                          <div key={key}>
                            {key} : {d[key]} <br />{" "}
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ))
            : ""}
        </div>
      </React.Fragment>
    );
  }
}

export default Statistics;
