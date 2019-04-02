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
import MyBadge from "./components/MyBadge";
import { Nav, Navbar } from "react-bootstrap";

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
      <div>
        <Navbar sticky="top" bg="dark" variant="dark">
          <Navbar.Brand exact="true" href="/">
            UNIRATE
          </Navbar.Brand>
          <Nav className="mr-auto" />
          <Nav>
            {!localStorage.getItem("token") ? (
              <Nav.Link href="/login">Login</Nav.Link>
            ) : null}
            {!localStorage.getItem("token") ? (
              <Nav.Link href="/register">SignUp</Nav.Link>
            ) : null}
            {localStorage.getItem("token") ? (
              <Nav.Link href="/settings">Settings</Nav.Link>
            ) : null}
            {localStorage.getItem("admin") &&
            localStorage.getItem("admin").includes(true) ? (
              <Nav.Link href="/admin">Admin</Nav.Link>
            ) : null}
            <Nav.Link
              onClick={() =>
                window.localStorage.clear() & window.location.replace("/login")
              }
              className="btn-outline-danger"
            >
              Logout
            </Nav.Link>
          </Nav>
          {/* <Form inline>
            <FormControl type="text" placeholder="Search" className="mr-sm-2" />
            <Button variant="outline-info">Search</Button>
          </Form> */}
        </Navbar>
        <MyBadge />
        <Router>
          <Switch>
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              path="/"
              exact
              testnet={testnet}
              component={
                <div>
                  <Home testnet={testnet} />
                </div>
              }
            />
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              path="/settings"
              testnet={testnet}
              component={<Settings testnet={testnet} />}
            />

            <Route
              path="/login"
              component={() => <Login testnet={testnet} />}
            />

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
      </div>
    );
  }
}

export default App;
