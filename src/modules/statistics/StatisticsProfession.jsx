import React, { Component } from "react";
class StatisticsProfession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      professions: [],
      faculties: []
    };
  }
  componentDidMount() {
    fetch(`${this.state.link}/admin/statistics/profession`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(res =>
        this.setState({
          professions: res.total ? res["profession"] : []
        })
      )
      .catch(err => console.log(err));

    fetch(`${this.state.link}/admin/faculty`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(res =>
        this.setState({
          faculties: res.total ? res["faculty"] : []
        })
      )
      .catch(err => console.log(err));
  }
  render() {
    const { professions, faculties } = this.state;
    return (
      <React.Fragment>
        <div className="homeFormCont col-10">
          {professions[0]
            ? professions.map(d => (
                <div key={d.id ? d.id : Date.now()}>
                  <div
                    className="list-group-item list-group-item-action progress-bar"
                    role="progressbar"
                    // aria-valuenow="75"
                    aria-valuemin="0"
                    aria-valuemax="100"
                    data-toggle="collapse"
                    href={"#col_" + (d.id ? d.id : Date.now())}
                    // aria-expanded="false"
                    aria-controls="collapseExample"
                  >
                    {d["id"] ? d["name"] : null}
                  </div>
                  <div
                    className="collapse"
                    id={"col_" + (d.id ? d.id : Date.now())}
                  >
                    <div className="card card-body">
                      <div>
                        Name: {d.name} <br />
                        Faculty:{" "}
                        {faculties
                          ? faculties.find(f => f.id == d["facultyId"])
                            ? faculties.find(f => f.id == d["facultyId"])[
                                "name"
                              ]
                            : d["facultyId"]
                          : d["facultyId"]}
                      </div>
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

export default StatisticsProfession;
