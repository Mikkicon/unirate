import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
class Private extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return this.props.isAuthenticated ? (
      this.props.path.toString() === "/admin" ? (
        this.props.isAdmin ? (
          <Route to={this.props.path} component={() => this.props.component} />
        ) : (
          <Redirect to="/login" />
        )
      ) : (
        <Route to={this.props.path} component={() => this.props.component} />
      )
    ) : (
      <Redirect to="/login" />
    );
  }
}

export default Private;
