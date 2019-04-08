import React, { Component } from "react";
import "./Styles/App.css";
import Registration from "./modules/Registration";
import Login from "./modules/Login";
import Home from "./modules/Home";
import Settings from "./modules/Settings";
import Admin from "./modules/Admin";
import Discipline from "./modules/Discipline";
import Private from "./modules/PrivateRoute";
import Faculty from "./modules/Faculty";
import Profession from "./modules/Profession";
import Teacher from "./modules/Teacher";
import MyBadge from "./modules/MyBadge";
import StatisticsHonest from "./modules/statistics/StatisticsHonest";
import StatisticsMostActiveUsers from "./modules/statistics/StatisticsMostActiveUsers";
import StatisticsPopularTeacher from "./modules/statistics/StatisticsPopularTeacher";
import StatisticsProfession from "./modules/statistics/StatisticsProfession";
import StatisticsRating from "./modules/statistics/StatisticsRating";
import Print from "./modules/Print";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";

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

            {localStorage.getItem("admin") &&
            localStorage.getItem("admin").includes(true) ? (
              <NavDropdown title="Statistics" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/statistics/profession">
                  Professions <br /> all mandatory disciplines have feedback
                </NavDropdown.Item>
                <NavDropdown.Item href="/statistics/most-active-profession">
                  most-active-profession
                </NavDropdown.Item>
                <NavDropdown.Item href="/statistics/popular-teacher">
                  Teachers <br /> ordered by feedback number
                </NavDropdown.Item>
                <NavDropdown.Item href="/statistics/most-active-user">
                  Users ordered by feedback number
                </NavDropdown.Item>
                <NavDropdown.Item href="statistics/teacher-most-honest-student">
                  Teachers ordered by feedback grades
                </NavDropdown.Item>
                <NavDropdown.Item href="/statistics/user-rating">
                  User rating + total number of feedback left
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
              <Nav.Link href="/admin">Admin</Nav.Link>
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
              path="/"
              exact
              testnet={testnet}
              component={<Home testnet={testnet} />}
            />

            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              path="/statistics/profession"
              testnet={testnet}
              component={<StatisticsProfession testnet={testnet} />}
            />
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              path="/statistics/popular-teacher"
              testnet={testnet}
              component={<StatisticsPopularTeacher testnet={testnet} />}
            />
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              path="/statistics/most-active-user"
              testnet={testnet}
              component={<StatisticsMostActiveUsers testnet={testnet} />}
            />
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              path="/statistics/teacher-most-honest-student"
              testnet={testnet}
              component={<StatisticsHonest testnet={testnet} />}
            />
            <Private
              isAuthenticated={isAuthenticated}
              isAdmin={isAdmin}
              path="/statistics/user-rating"
              testnet={testnet}
              component={<StatisticsRating testnet={testnet} />}
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
