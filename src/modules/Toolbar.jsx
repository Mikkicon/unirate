import React, { Component } from "react";
import { Dropdown, DropdownButton, ButtonToolbar } from "react-bootstrap";
class Toolbar extends Component {
  state = {};
  render() {
    const {
      selectedEntity,
      theme,
      select,
      entities,
      search,
      setTheme,
      total
    } = this.props;
    return (
      <ButtonToolbar>
        {select ? (
          <DropdownButton
            variant="warning"
            id="dropdown-basic-button"
            title={selectedEntity ? selectedEntity.toUpperCase() : ""}
          >
            {entities.map(e => (
              <Dropdown.Item key={e} onSelect={() => select(e)}>
                {e}
              </Dropdown.Item>
            ))}
          </DropdownButton>
        ) : null}

        <a
          className={
            selectedEntity === "faculty"
              ? "btn btn-primary disabled"
              : "btn btn-primary"
          }
          data-toggle="collapse"
          href="#filter"
          role="button"
          aria-expanded="false"
        >
          FILTER
        </a>

        <b />
        <DropdownButton
          variant="warning"
          id="dropdown-basic-button"
          title="SORT"
        >
          <Dropdown.Item
            onClick={() => {
              search({ limit: 20, orderBy: "name" });
            }}
            key="a-asc"
          >
            Alphabet A->Z
          </Dropdown.Item>
          <Dropdown.Item
            onClick={() => {
              search({ limit: 20, orderBy: "name DESC" });
            }}
            key="a-desc"
          >
            Alphabet Z->A
          </Dropdown.Item>
          {selectedEntity === "discipline" ? (
            <div>
              <Dropdown.Item
                onClick={() => {
                  search({ limit: 20, orderBy: "feedbackNum" });
                }}
                key="f-asc"
              >
                Feedbacks 0->N
              </Dropdown.Item>
              <Dropdown.Item
                onClick={() => {
                  search({ limit: 20, orderBy: "feedbackNum DESC" });
                }}
                key="f-desc"
              >
                Feedbacks N->0
              </Dropdown.Item>
            </div>
          ) : (
            ""
          )}
        </DropdownButton>
        <div className="toolItem">
          {/* <small>infinite scroll</small> */}
          <label className="switch">
            <input
              // checked={this.state.enableScroll}
              type="checkbox"
              onChange={() => (theme ? setTheme(false) : setTheme(true))}
            />
            <span className="slider round" />
          </label>
        </div>

        <div className="toolItem">
          <h4>Found {total}</h4>
        </div>
      </ButtonToolbar>
    );
  }
}

export default Toolbar;
