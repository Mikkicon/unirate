import React, { Component } from "react";
import "./Styles/App.css";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Home from "./components/Home";
import Settings from "./components/Settings";
import Admin from "./components/Admin";
import Discipline from "./components/Discipline";
import Private from "./components/PrivateRoute";
import Faculty from "./components/Faculty";
import Profession from "./components/Profession";
import Teacher from "./components/Teacher";

// import Discipline1 from "./components/Discipline1";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testnet: false,
      isAdmin: window.localStorage.getItem("admin") ? true : false,
      isAuthenticated: window.localStorage.getItem("token") ? true : false
    };
  }

  componentDidMount = async () => {};

  render() {
    const { testnet, isAdmin, isAuthenticated } = this.state;
    return (
      <Router>
        <Switch>
          <Private
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            path="/"
            exact
            testnet={testnet}
            component={<Home testnet={testnet} />}
          />
          <Private
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            path="/settings"
            testnet={testnet}
            component={<Settings testnet={testnet} />}
          />

          <Route path="/login" component={() => <Login testnet={testnet} />} />

          <Route
            path="/register"
            testnet={testnet}
            component={() => <Registration testnet={testnet} />}
          />
          <Private
            isAuthenticated={isAuthenticated}
            isAdmin={isAdmin}
            path="/discipline"
            testnet={testnet}
            component={<Discipline testnet={testnet} />}
          />
          <Private
            isAuthenticated={this.state.isAuthenticated}
            isAdmin={this.state.isAdmin}
            path="/faculty"
            component={<Faculty />}
          />
          <Private
            isAuthenticated={this.state.isAuthenticated}
            isAdmin={this.state.isAdmin}
            path="/profession"
            component={<Profession />}
          />
          <Private
            isAuthenticated={this.state.isAuthenticated}
            isAdmin={this.state.isAdmin}
            path="/teacher"
            component={<Teacher />}
          />

          <Private
            isAuthenticated={this.state.isAuthenticated}
            isAdmin={this.state.isAdmin}
            path="/admin"
            testnet={testnet}
            component={<Admin testnet={testnet} />}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
