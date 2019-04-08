import React, { Component } from "react";
class StatisticsHonest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      teachers: []
    };
  }
  componentDidMount() {
    fetch(`${this.state.link}/admin/statistics/teacher-most-honest-student`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(res =>
        this.setState({
          teachers: res.total ? res[Object.keys(res)[1]] : []
        })
      )
      .catch(err => console.log(err));
  }
  render() {
    const { teachers } = this.state;
    return (
      <React.Fragment>
        <div className="homeFormCont col-10">
          {teachers[0]
            ? teachers.map(d => (
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
                    {d["lastName"]
                      ? d["lastName"] + " " + d["name"] + " " + d["middleName"]
                      : null}
                  </div>
                  <div
                    className="collapse"
                    id={"col_" + (d.id ? d.id : Date.now())}
                  >
                    <div className="card card-body">
                      <div>
                        Lastname: {d.lastName} <br /> Name: {d.name} <br />
                        MiddleName: {d.middleName}
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

export default StatisticsHonest;
