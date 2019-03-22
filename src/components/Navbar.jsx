import React, { Component } from "react";
import "../Styles/Navbar.css";
import {Link} from "react-router-dom";
import {Button, Nav} from "react-bootstrap";
class Navbar extends Component {
    state = {
        token: localStorage.getItem("token")
    };
    render() {
        if(this.state.token == 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpbiI6Im1pa2tpY29uQSIsInJpZ2h0IjoiYWRtaW4iLCJjcmVhdGVkIjoxNTUzMDk0NTY4fQ.8xklcjdtHZt7YZT3vP43GZ0v4VnAEbnDcipWy_2-EOc'){
            return <React.Fragment>
                <div className="adminFormCont col-10">
                    <h1>Admin Settings</h1>
                    <br />
                    <Link className="btn btn-outline-primary" to="/">
                        Home
                    </Link>
                    <Link className="btn btn-outline-primary" to="/settings">
                        Settings
                    </Link>
                    <Link className="btn btn-outline-primary" to="/admin">
                        Admin
                    </Link>
                    <Button className="btn-outline-danger" onClick={this.logout}>Logout</Button>
                </div>
            </React.Fragment>;
        }
        else if(this.state.token){
            return <React.Fragment>
                <div className="homeFormCont col-10">
                    <Link className="btn btn-outline-primary" to="/">
                        Home
                    </Link>
                    <Link className="btn btn-outline-primary" to="/settings">
                        Settings
                    </Link>
                    <Navbar title="LOAD">
                        <Nav.Link id="user" onClick={this.selectEntity.bind(this)}>
                            USERS
                        </Nav.Link>
                        <Nav.Link id="teacher" onClick={this.selectEntity.bind(this)}>
                            TEACHERS
                        </Nav.Link>
                        <Nav.Link id="discipline" onClick={this.selectEntity.bind(this)}>
                            DISCIPLINES
                        </Nav.Link>
                        <Nav.Link id="feedback" onClick={this.selectEntity.bind(this)}>
                            FEEDBACKS
                        </Nav.Link>
                        <Nav.Link id="faculty" onClick={this.selectEntity.bind(this)}>
                            FACULTIES
                        </Nav.Link>
                        <Nav.Link id="profession" onClick={this.selectEntity.bind(this)}>
                            PROFESSIONS
                        </Nav.Link>
                    </Navbar>
                    <Button className="btn-outline-danger" onClick={this.logout}>Logout</Button>
                </div>
            </React.Fragment>;
        }
        else{
            return <React.Fragment>
                <div className="homeFormCont col-10">
                    <Link className="btn btn-outline-primary" to="/register">
                        Registration
                    </Link>
                    <Link className="btn btn-outline-primary" to="/login">
                        Login
                    </Link>
                </div>
            </React.Fragment>;
        }
    }
}

export default Navbar;
