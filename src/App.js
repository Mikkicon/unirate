import React, { Component } from "react";
import "./Styles/App.css";
import Registration from "./components/Registration";
import Login from "./components/Login";
import Home from "./components/Home";
import Settings from "./components/Settings";
import Admin from "./components/Admin";
import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
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
        <div>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/settings" component={() => <Settings />} />
          <Route path="/login" component={() => <Login />} />
          <Route path="/register" component={() => <Registration />} />
          {/* <Route path="/admin/user" component={() => <Registration />} />
          <Route path="/admin/teacher" component={() => <Registration />} /> */}
          <Route path="/admin" component={() => <Admin />} />
        </div>
      </Router>
    );
  }
}

export default App;
