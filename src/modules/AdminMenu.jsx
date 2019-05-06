import React, { Component } from "react";
import { Link } from "react-router-dom";
class AdminMenu extends Component {
  state = {};
  render() {
    const { theme } = this.props;
    return (
      <div
        style={{ margin: "auto" }}
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
    );
  }
}

export default AdminMenu;
