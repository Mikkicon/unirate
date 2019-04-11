import React, { Component } from "react";
class StatisticsMostActiveUsers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      users: [],
      professions: []
    };
  }
  componentDidMount() {
    fetch(`${this.state.link}/admin/statistics/user-rating?limit=1000`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(res =>
        this.setState({
          users: res.total ? res[Object.keys(res)[1]] : []
        })
      )
      .catch(err => console.log(err));

    fetch(`${this.state.link}/admin/profession`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(res =>
        this.setState({
          professions: res.total ? res.profession : []
        })
      )
      .catch(err => console.log(err));
  }
  render() {
    const { users, professions } = this.state;
    return (
      <React.Fragment>
        <div className="homeFormCont col-10">
          {users[0]
            ? users.map(d => (
                <div key={d.login ? d.login : Date.now()}>
                  <div
                    className="list-group-item list-group-item-action progress-bar"
                    role="progressbar"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    data-toggle="collapse"
                    href={"#col_" + (d.login ? d.login : Date.now())}
                    aria-controls="collapseExample"
                  >
                    {d["login"]
                      ? d["login"] +
                        " - " +
                        d["totalFeedbackNumber"] +
                        " feedbacks left"
                      : null}
                  </div>
                  <div
                    className="collapse"
                    id={"col_" + (d.login ? d.login : Date.now())}
                  >
                    <div className="card card-body">
                      <div>
                        Login: {d["login"]} <br /> Number of feedbacks:{" "}
                        {d["totalFeedbackNumber"]} <br />
                        Profession:
                        {d["professionId"]
                          ? professions
                            ? professions.find(f => f.id === d["professionId"])
                              ? professions.find(
                                  f => f.id === d["professionId"]
                                )["name"]
                              : d["professionId"]
                            : d["professionId"]
                          : "Hasn't provided."}
                        <br />
                        Rating: {d["rating"]}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : "loading.."}
        </div>
      </React.Fragment>
    );
  }
}

export default StatisticsMostActiveUsers;
