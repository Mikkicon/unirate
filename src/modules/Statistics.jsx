import React, { Component } from "react";
class Statistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      entities: [],
      faculties: []
    };
  }
  componentDidMount() {
    fetch(`${this.state.link}/admin/statistics/${this.props.entity}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(res =>
        this.setState({
          entities: res.total ? res[Object.keys(res)[1]] : []
        })
      )
      .catch(err => console.log(err));
  }
  render() {
    const { entities } = this.state;
    return (
      <React.Fragment>
        <div className="homeFormCont col-10">
          {entities[0]
            ? entities.map(d => (
                <div key={d.id ? d.id : d.login}>
                  <div
                    className="list-group-item list-group-item-action"
                    data-toggle="collapse"
                    href={"#col_" + (d.id ? d.id : d.login)}
                  >
                    {d[Object.keys(d)[1]]}:{" "}
                    {
                      d[
                        Object.keys(d).find(
                          f =>
                            f.toLowerCase().indexOf("num") !== -1 ||
                            f.toLowerCase().indexOf("like") !== -1 ||
                            f.toLowerCase().indexOf("total") !== -1
                        )
                      ]
                    }
                  </div>
                  <div
                    className="collapse"
                    id={"col_" + (d.id ? d.id : d.login)}
                  >
                    <div className="card card-body">
                      <div>
                        {Object.keys(d)
                          .slice(1)
                          .map(m => (
                            <div key={d[m]}>
                              {" "}
                              <b>{m}:</b> {d[m]} <br />
                            </div>
                          ))}
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

export default Statistics;
