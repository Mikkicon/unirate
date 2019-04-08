import React, { Component } from "react";
import "../Styles/Navbar.css";
import { Button } from "react-bootstrap";

class MyNavbar extends Component {
  state = {
    token: localStorage.getItem("token")
  };
  render() {
    return (
      //   <div className="main">
      //     <a className="btnstyle" href="/">
      //       Home
      //     </a>
      //     <a className="btn btn-outline-primary" href="/register">
      //       Registration
      //     </a>
      //     <a className="btn btn-outline-primary" href="/login">
      //       Login
      //     </a>
      //     <a className="btn btn-outline-primary" href="/settings">
      //       Settings
      //     </a>
      //     <a className="btn btn-outline-primary" href="/admin">
      //       Admin
      //     </a>
      //     <Button
      //       onClick={() =>
      //         window.localStorage.clear() & window.location.replace("/login")
      //       }
      //       className="btn-outline-danger"
      //     >
      //       Logout
      //     </Button>
      //   </div>
      <div />
    );
  }
}

export default MyNavbar;
