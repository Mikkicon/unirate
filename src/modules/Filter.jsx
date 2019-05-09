import React, { Component } from "react";
class Filter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disciplines: null,
      faculties: null,
      query: {},
      mandatory: null
    };
    if (props.options.indexOf("mandatoryProfessionId") !== -1) {
      this.getProfNames();
    }
  }
  getProfNames = async () => {
    const link = this.props.admin
      ? this.props.link + "/admin/profession"
      : this.props.link + "/profession";
    fetch(link, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(a => a.json())
      .then(b => this.setState({ mandatory: b.profession }));
  };
  render() {
    const { search, options, theme, faculties } = this.props;
    const { query, mandatory } = this.state;
    return (
      <div className="collapse" id="filter">
        <div className={theme ? "dark-card card card-body" : "card card-body"}>
          {options.includes("faculty") ? (
            <div>
              <div className="row">
                <b className=" col-3">Faculty</b>
                <select
                  className="form-control col-9"
                  type="text"
                  onChange={p => {
                    var a = query;
                    a["facultyId"] = Number(p.target.value);
                    this.setState({ query: a }, () => search(a));
                  }}
                >
                  {faculties
                    ? faculties.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.shortName})
                        </option>
                      ))
                    : ""}
                </select>
              </div>

              <hr />
            </div>
          ) : (
            ""
          )}
          {options.includes("year") ? (
            <div>
              <div className="row">
                <b className=" col-3">Year</b>
                <select
                  className="form-control col-9"
                  placeholder="Year"
                  onChange={p => {
                    const a = query;
                    if (p.target.value === "All") {
                      delete a["year"];
                    } else {
                      a["year"] = Number(p.target.value);
                    }
                    this.setState({ query: a }, () => search(a));
                  }}
                >
                  <option>All</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
              </div>

              <hr />
            </div>
          ) : null}
          {options.includes("mandatoryProfessionId") ? (
            <div>
              <div className="row">
                <b className=" col-3">Mandatory</b>
                <select
                  className="form-control col-9"
                  placeholder="mandatoryProfessionId"
                  onChange={p => {
                    const a = query;
                    if (p.target.value === "All") {
                      delete a["mandatoryProfessionId"];
                    } else {
                      a["mandatoryProfessionId"] = Number(p.target.value);
                    }
                    this.setState({ query: a }, () => search(a));
                  }}
                >
                  <option>All</option>
                  {mandatory
                    ? mandatory.map(a => (
                        <option key={a.id} value={a.id}>
                          {a.name}
                        </option>
                      ))
                    : ""}
                </select>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    );
  }
}

export default Filter;
