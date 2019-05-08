import React, { Component } from "react";
import Pagination from "react-bootstrap/Pagination";
import { MdEdit } from "react-icons/md";
class UserList extends Component {
  state = {};
  render() {
    const {
      entities,
      pages,
      total,
      selectDiscipline,
      response,
      theme,
      search
    } = this.props;

    return (
      <div
        className={theme ? "row userListBlack col-6" : " row col-6 userList"}
      >
        <h3>DISCIPLINES {response}</h3>
        <div className="list-group col-12">
          {entities
            ? entities.map(u => (
                <div
                  style={{ cursor: "pointer" }}
                  key={u[Object.keys(u)[0]] ? u[Object.keys(u)[0]] : "new"}
                  onClick={selectDiscipline.bind(this.id)}
                  className={
                    theme
                      ? "list-group-item list-group-item-primary list-group-item-action progress-bar"
                      : "list-group-item list-group-item-action progress-bar"
                  }
                  id={u[Object.keys(u)[0]]}
                >
                  {u[Object.keys(u)[1]]}

                  <MdEdit style={{ float: "right" }} />
                </div>
              ))
            : ""}
          <br />
          <Pagination style={total < 10 ? { display: "none" } : {}}>
            <Pagination.First onClick={() => search("")} />
            <Pagination.Prev disabled={entities ? false : true} />
            {pages()}
            <Pagination.Next />
            <Pagination.Last
              onClick={() =>
                search({
                  offset: Math.floor(total / 10) * 10
                })
              }
            />
          </Pagination>
        </div>
      </div>
    );
  }
}

export default UserList;
