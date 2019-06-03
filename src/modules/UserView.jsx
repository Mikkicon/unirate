import React, { Component } from "react";
class UserView extends Component {
  state = {
    UDPEntity: {},
    selectedItem: {}
  };
  componentWillReceiveProps = props => {
    this.setState({ selectedItem: props.selectedItem, UDPEntity: {} });
  };
  render() {
    const {
      theme,
      post,
      addNew,
      entityAction,
      attributes,
      faculties
    } = this.props;
    const { selectedItem, UDPEntity } = this.state;
    return (
      <div className={theme ? "userViewBlack col-5" : "col-5 userView"}>
        {selectedItem ? (
          <div className="list-group">
            <h2>
              {selectedItem ? selectedItem[attributes.attributes[0]] : ""}
            </h2>
            <br />
            {attributes.attributes.map(attrName => (
              <div key={attrName}>
                <b>{attrName}</b> : <br />
                {attrName === "teachers" ? (
                  selectedItem[attrName] ? (
                    selectedItem[attrName].map(teacher => (
                      <div key={teacher}>{teacher.lastName}</div>
                    ))
                  ) : (
                    ""
                  )
                ) : post && attrName === "facultyName" ? (
                  <select
                    onChange={e => {
                      e.persist();
                      const tempUDPEntity = this.state.UDPEntity;
                      const tempselectedItem = this.state.selectedItem;
                      tempUDPEntity["facultyId"] = Number(e.target.value);
                      tempselectedItem[attrName] = e.target.name;
                      this.setState({
                        UDPEntity: tempUDPEntity,
                        selectedItem: tempselectedItem
                      });
                    }}
                  >
                    {faculties.map(faculty => (
                      <option
                        key={faculty.id}
                        value={faculty.id}
                        name={faculty.name}
                      >
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                ) : attributes.editable.includes(attrName) ? (
                  <input
                    className="list-group-item-action list-group-item"
                    type="text"
                    name={selectedItem[attrName]}
                    value={
                      selectedItem[attrName] || selectedItem[attrName] === 0
                        ? selectedItem[attrName]
                        : ""
                    }
                    onChange={e => {
                      e.persist();
                      const tempUDPEntity = this.state.UDPEntity;
                      const tempselectedItem = this.state.selectedItem;
                      tempUDPEntity[attrName] =
                        attrName === "year"
                          ? Number(e.target.value)
                          : e.target.value;
                      tempselectedItem[attrName] = e.target.value;
                      this.setState({
                        UDPEntity: tempUDPEntity,
                        selectedItem: tempselectedItem
                      });
                    }}
                  />
                ) : (
                  <div>{selectedItem[attrName]}</div>
                )}
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
                    // disabled={!selectedItem["name"] || !selectedItem["year"]}
                    onClick={() => entityAction("POST", UDPEntity)}
                    className="btn btn-outline-primary col-12"
                  >
                    POST
                  </button>
                )
              ) : (
                <button
                  key={button}
                  disabled={post}
                  style={{ margin: "auto", marginTop: "20px" }}
                  onClick={() =>
                    entityAction(button === "SAVE" ? "PUT" : button, UDPEntity)
                  }
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
