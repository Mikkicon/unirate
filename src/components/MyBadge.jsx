import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { FaArrowUp } from "react-icons/fa";
import "../Styles/Badge.css";
class MyBadge extends Component {
  state = {};
  render() {
    return (
      <div id="badge">
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="btn btn-outline-primary"
        >
          <FaArrowUp />
        </Button>
      </div>
    );
  }
}

export default MyBadge;
