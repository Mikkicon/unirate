import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import AdminTemplate from "./AdminTemplate";
class Private extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { path, isAdmin, isAuthenticated, component, testnet } = this.props;
    return isAuthenticated ? (
      path.toString().includes("/admin") ? (
        isAdmin ? (
          <Route to={path} component={testnet => component} />
        ) : (
          <Redirect to="/login" />
        )
      ) : path.toString() === "/" && isAdmin ? (
        <Redirect
          to="/admin-template"
          component={<AdminTemplate testnet={testnet} />}
        />
      ) : (
        <Route to={path} component={testnet => component} />
      )
    ) : (
      <Redirect to="/login" />
    );
  }
}

export default Private;
