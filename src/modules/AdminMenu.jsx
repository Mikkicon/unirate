import React, { Component } from "react";
import { Link } from "react-router-dom";
class AdminMenu extends Component {
  state = {};
  render() {
    const { theme, selectEntity, toggle } = this.props;
    return (
      <React.Fragment>
        {!toggle ? (
          <div
            // style={{ margin: "auto" }}
            className={theme ? "userListBlack col-5" : "col-5 userList"}
          >
            <Link className="btn btn-outline-info" to="/admin-user">
              USERS
            </Link>
            <Link className="btn btn-outline-info" to="/admin-teacher">
              TEACHERS
            </Link>
            <Link className="btn btn-outline-info" to="/admin-discipline">
              DISCIPLINES
            </Link>
            <Link className="btn btn-outline-info" to="/admin-feedback">
              FEEDBACKS
            </Link>
            <Link className="btn btn-outline-info" to="/admin-faculty">
              FACULTIES
            </Link>
            <Link className="btn btn-outline-info" to="/admin-profession">
              PROFESSIONS
            </Link>
          </div>
        ) : (
          <div className={theme ? "userListBlack col-5" : "col-5 userList"}>
            <button
              className="btn btn-outline-info"
              onClick={() => selectEntity("user")}
            >
              USERS
            </button>
            <button
              className="btn btn-outline-info"
              onClick={() => selectEntity("teacher")}
            >
              TEACHERS
            </button>
            <button
              className="btn btn-outline-info"
              onClick={() => selectEntity("discipline")}
            >
              DISCIPLINES
            </button>
            <button
              className="btn btn-outline-info"
              onClick={() => selectEntity("feedback")}
            >
              FEEDBACKS
            </button>
            <button
              className="btn btn-outline-info"
              onClick={() => selectEntity("faculty")}
            >
              FACULTIES
            </button>
            <button
              className="btn btn-outline-info"
              onClick={() => selectEntity("profession")}
            >
              PROFESSIONS
            </button>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default AdminMenu;
