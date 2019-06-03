import React, { Component } from "react";
import "./Styles/App.css";
import "bootstrap";
import Registration from "./modules/Components/Registration";
import Login from "./modules/Components/Login";
import Home from "./modules/Compounds/Home";
import Settings from "./modules/Compounds/Settings";
import Admin from "./modules/Components/Admin";
import AdminTemplate from "./modules/Compounds/AdminTemplate";
import Discipline from "./modules/Compounds/Discipline";
import Private from "./modules/Compounds/PrivateRoute";
import MyBadge from "./modules/Components/MyBadge";
import Statistics from "./modules/Components/Statistics";
import Print from "./modules/Components/Print";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      testnet: true,
      isAdmin: window.localStorage.getItem("admin") === "true" ? true : false,
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

            {localStorage.getItem("admin") &&
            localStorage.getItem("admin").includes(true) ? (
              <NavDropdown title="Statistics" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/statistics/profession">
                  Professions <br /> all mandatory disciplines have feedback
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/statistics/popular-teacher">
                  Teachers <br /> ordered by feedback number
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/statistics/most-active-user">
                  Users ordered by feedback number
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/statistics/teacher-most-honest-student">
                  Teachers ordered by feedback grades
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/statistics/user-rating">
                  User rating + total number of feedback left
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/statistics/most-active-profession">
                  Popular professions
                </NavDropdown.Item>
              </NavDropdown>
            ) : null}
            {localStorage.getItem("admin") &&
            localStorage.getItem("admin").includes(true) ? (
              <NavDropdown title="Reports" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/reports/discipline">
                  Disciplines
                </NavDropdown.Item>
                <NavDropdown.Item href="/reports/profession">
                  Professions
                </NavDropdown.Item>
                <NavDropdown.Item href="/reports/faculty">
                  Faculties
                </NavDropdown.Item>
                <NavDropdown.Item href="/reports/teacher">
                  Teachers
                </NavDropdown.Item>
                <NavDropdown.Item href="/reports/user">Users</NavDropdown.Item>
              </NavDropdown>
            ) : null}
            {localStorage.getItem("admin") &&
            localStorage.getItem("admin").includes(true) ? (
              <Nav.Link href="/admin-discipline">Admin</Nav.Link>
            ) : null}
            {localStorage.getItem("token") ? (
              <Nav.Link href="/settings">Settings</Nav.Link>
            ) : null}

            {localStorage.getItem("token") ? (
              <Nav.Link
                onClick={() =>
                  window.localStorage.clear() &
                  window.location.replace("/login")
                }
                className="btn-outline-danger"
              >
                Logout
              </Nav.Link>
            ) : null}
          </Nav>
        </Navbar>
        <MyBadge />
        <Router>
          <Switch>
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              exact
              path="/"
              testnet={testnet}
              component={<Home testnet={testnet} />}
            />
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              exact
              path="/statistics/profession"
              testnet={testnet}
              component={
                <Statistics
                  entity={"most-active-profession"}
                  testnet={testnet}
                />
              }
            />
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              exact
              path="/statistics/popular-teacher"
              testnet={testnet}
              component={
                <Statistics entity={"popular-teacher"} testnet={testnet} />
              }
            />
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              exact
              path="/statistics/most-active-user"
              testnet={testnet}
              component={
                <Statistics entity={"most-active-user"} testnet={testnet} />
              }
            />
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              exact
              path="/statistics/teacher-most-honest-student"
              testnet={testnet}
              component={
                <Statistics
                  entity={"teacher-most-honest-student"}
                  testnet={testnet}
                />
              }
            />
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              exact
              path="/statistics/user-rating"
              testnet={testnet}
              component={
                <Statistics entity={"user-rating"} testnet={testnet} />
              }
            />
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              exact
              path="/statistics/most-active-profession"
              testnet={testnet}
              component={
                <Statistics
                  entity={"most-active-profession"}
                  testnet={testnet}
                />
              }
            />
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              path="/reports"
              testnet={testnet}
              component={<Print testnet={testnet} />}
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
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              path="/admin"
              testnet={testnet}
              component={<Admin testnet={testnet} />}
            />
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              path="/admin-template"
              testnet={testnet}
              component={<AdminTemplate testnet={testnet} />}
            />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
