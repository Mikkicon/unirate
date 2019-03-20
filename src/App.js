import React, { Component } from "react";
import "./Styles/App.css";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Home from "./components/Home";
import Settings from "./components/Settings";
import Admin from "./components/Admin";
import Discipline from "./components/Discipline";
import Private from "./components/PrivateRoute";
import Discipline1 from "./components/Discipline1";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAdmin: window.localStorage.getItem("admin") ? true : false,
      isAuthenticated: window.localStorage.getItem("token") ? true : false
    };
  }
  componentDidMount = async () => {
    // console.log("Mounted.");
    await fetch(
      "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/"
    )
      .then(response => {
        response.status === 200
          ? console.log("Estabilished connection with server")
          : console.log("Error occured with code: ", response.status);
      })
      .catch(err =>
        console.log("Couldn't establish connection with server", err)
      );
  };

  render() {
    return (
      <Router>
        <Switch>
          <Private
            isAuthenticated={this.state.isAuthenticated}
            isAdmin={this.state.isAdmin}
            path="/"
            exact
            component={<Home />}
          />
          <Private
            isAuthenticated={this.state.isAuthenticated}
            isAdmin={this.state.isAdmin}
            path="/settings"
            component={<Settings />}
          />
          <Route path="/login" component={() => <Login />} />
          {/* <Route path="/admin" component={() => <Admin />} /> */}
          <Route path="/register" component={() => <Registration />} />
          <Route path="/admin/discipline" component={() => <Discipline1 />} />
          <Private
            isAuthenticated={this.state.isAuthenticated}
            isAdmin={this.state.isAdmin}
            path="/discipline"
            component={<Discipline />}
          />
          <Private
            isAuthenticated={this.state.isAuthenticated}
            isAdmin={this.state.isAdmin}
            path="/admin"
            component={<Admin />}
          />
        </Switch>
      </Router>
    );
  }
}

export default App;
