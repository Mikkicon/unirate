import React, { Component } from "react";
class UserView extends Component {
  state = {};
  render() {
    const {
      theme,
      selectedDiscipline,
      faculties,
      post,
      addNew,
      query,
      putEntity,
      entityAction,
      postEntity
    } = this.props;
    return (
      <div className={theme ? "userViewBlack col-5" : "col-5 userView"}>
        {selectedDiscipline ? (
          <div>
            <h2>{selectedDiscipline[Object.keys(selectedDiscipline)[1]]}</h2>
            <div className="list-group">
              <div>
                <span>Name:</span>
                <input
                  type="text"
                  onChange={e => {
                    const sel = selectedDiscipline;
                    sel["name"] = e.target.value;
                    this.setState({ selectedDiscipline: sel });
                  }}
                  className={
                    theme
                      ? "search list-group-item list-group-item-action"
                      : "list-group-item list-group-item-action"
                  }
                  value={selectedDiscipline["name"]}
                />
                <hr />
              </div>
              <div>
                <span>Year:</span>
                <select
                  onChange={e => {
                    const sel = selectedDiscipline;
                    sel["year"] = e.target.value;
                    this.setState({ selectedDiscipline: sel });
                  }}
                  className={
                    theme
                      ? "search list-group-item list-group-item-action form-control"
                      : "list-group-item list-group-item-action form-control"
                  }
                >
                  <option>0</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                </select>
                <hr />
              </div>
              <div>
                <span>Faculty:</span>
                <select
                  className={
                    theme
                      ? "search list-group-item list-group-item-action form-control"
                      : "list-group-item list-group-item-action form-control"
                  }
                  type="text"
                  onChange={p => {
                    var a = selectedDiscipline;
                    a["facultyId"] = Number(p.target.value);
                    var query1 = query;
                    query1["facultyId"] = Number(p.target.value);
                    this.setState({ selectedDiscipline: a, query: query1 });
                  }}
                >
                  {faculties
                    ? selectedDiscipline["id"]
                      ? faculties.map(a => (
                          <option
                            key={a.id}
                            value={a.id}
                            selected={
                              a.name === selectedDiscipline["facultyName"]
                            }
                          >
                            {a.name} ({a.shortName})
                          </option>
                        ))
                      : faculties.map(a => (
                          <option key={a.id} value={a.id}>
                            {a.name} ({a.shortName})
                          </option>
                        ))
                    : ""}
                </select>
              </div>
            </div>
            {selectedDiscipline["name"] ? (
              <div>
                <button
                  onClick={() => entityAction("PUT")}
                  className="btn btn-outline-primary"
                >
                  SAVE
                </button>
                <button
                  onClick={() => entityAction("DELETE")}
                  className="btn btn-outline-danger"
                >
                  DELETE
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
        {!post ? (
          <button
            onClick={addNew}
            style={{ margin: "auto", marginTop: "20px" }}
            className="btn btn-outline-primary col-12"
          >
            ADD NEW
          </button>
        ) : (
          <button
            disabled={
              !selectedDiscipline["name"] || !selectedDiscipline["year"]
            }
            onClick={() => entityAction("POST")}
            className="btn btn-outline-primary col-11"
          >
            POST
          </button>
        )}
      </div>
    );
  }
}

export default UserView;
