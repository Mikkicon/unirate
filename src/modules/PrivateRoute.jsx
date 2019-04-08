import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
class Private extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { path, isAdmin, isAuthenticated, component } = this.props;
    return isAuthenticated ? (
      path.toString() === "/admin" ? (
        isAdmin ? (
          <Route to={path} component={testnet => component} />
        ) : (
          <Redirect to="/login" />
        )
      ) : (
        <Route to={path} component={testnet => component} />
      )
    ) : (
      <Redirect to="/login" />
    );
  }
}

export default Private;
