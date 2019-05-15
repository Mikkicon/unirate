import React, { Component } from "react";
class UserView extends Component {
  state = {};
  render() {
    const {
      theme,
      selectedItem,
      faculties,
      post,
      addNew,
      query,
      entityAction,
      attributes
    } = this.props;
    console.log(attributes);
    return (
      <div className={theme ? "userViewBlack col-5" : "col-5 userView"}>
        {selectedItem ? (
          <div className="list-group">
            <h2>
              {selectedItem ? selectedItem[attributes.attributes[0]] : ""}
            </h2>
            {attributes.attributes.map(attrName => (
              <div
                key={attrName}
                className="list-group-item-action list-group-item"
              >
                {attrName} :
                {attrName === "teachers"
                  ? selectedItem[attrName]
                    ? selectedItem[attrName].map(teacher => (
                        <div key={teacher}>{teacher.lastName}</div>
                      ))
                    : ""
                  : selectedItem[attrName]}
                <br />
              </div>
            ))}
            {attributes.buttons.map(button =>
              button === "POST" ? (
                !post ? (
                  <button
                    key={button}
                    onClick={addNew}
                    style={{ margin: "auto", marginTop: "20px" }}
                    className="btn btn-outline-primary col-12"
                  >
                    ADD NEW
                  </button>
                ) : (
                  <button
                    key={button}
                    style={{ margin: "auto", marginTop: "20px" }}
                    disabled={!selectedItem["name"] || !selectedItem["year"]}
                    onClick={() => entityAction("POST")}
                    className="btn btn-outline-primary col-12"
                  >
                    POST
                  </button>
                )
              ) : (
                <button
                  key={button}
                  style={{ margin: "auto", marginTop: "20px" }}
                  onClick={() => entityAction(button)}
                  className="btn btn-outline-primary col-12"
                >
                  {button}
                </button>
              )
            )}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default UserView;
