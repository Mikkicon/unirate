import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import { Button } from "react-bootstrap";
class Discipline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      discipline: {},
      color: 0,
      feedback: null,
      feedbacks: null
    };
  }
  componentDidMount = () => {
    fetch(
      `${this.state.link}/discipline?id=${window.location.href.substr(
        window.location.href.indexOf("discipline") + 11,
        window.location.href.length
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    )
      .then(res => res.json())
      .then(res => this.setState({ discipline: res.discipline[0] }))
      .then(console.log(this.state))
      .catch(err => console.log(err));

    fetch(
      `${this.state.link}/feedback?disciplineId=${window.location.href.substr(
        window.location.href.indexOf("discipline") + 11,
        window.location.href.length
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    )
      .then(res => res.json())
      .then(res =>
        res.feedback
          ? this.setState({ feedbacks: res.feedback, totalFb: res.total })
          : this.setState({ feedbacks: [], totalFb: 0 })
      )
      .then(console.log(this.state))
      .catch(err => console.log(err));
  };

  like = e => {
    switch (this.state.color) {
      case 1:
        this.doLike(0, -1, e);
        break;
      case 0:
        this.doLike(1, 1, e);
        break;
      case -1:
        this.doLike(1, 2, e);
        break;
      default:
        console.log("Error while changing likes");

        break;
    }

    // fetch(`${this.state.link}/feedback/grade/${e.feedbackId}`, {
    //   method: "POST",
    //   body: JSON.stringify({ like: 1 }),
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: "Bearer " + localStorage.getItem("token")
    //   }
    // })
    //   .then(res => res.json())
    //   .then();
  };
  dislike = e => {
    switch (this.state.color) {
      case 1:
        this.doLike(-1, -2, e);
        break;
      case 0:
        this.doLike(-1, -1, e);
        break;
      case -1:
        this.doLike(0, 1, e);
        break;
      default:
        console.log("Error while changing likes");

        break;
    }
  };
  doLike = (a, b, e) => {
    this.setState({ color: a });
    let a1 = e.feedbackId ? this.setState({ feedback: e }) : "";
    let fb = this.state.feedbacks;
    fb.map(f =>
      f.feedbackId === e.feedbackId ? (f.rating = f.rating + b) : ""
    );
    this.setState({ feedbacks: fb });
  };
  render() {
    const { discipline, feedback, color, feedbacks } = this.state;
    console.log(discipline);
    return (
      <React.Fragment>
        <div style={{ margin: "0 auto 0 auto" }} className="col-10">
          <h1>
            {discipline[Object.keys(discipline)[1]]} <small>name</small>
          </h1>
          <h2>
            {discipline[Object.keys(discipline)[2]]} <small>year</small>
            {discipline[Object.keys(discipline)[3]]} <small>faculty</small>
          </h2>
          <div style={{ margin: "0 auto 0 auto" }} className="col-10">
            {feedbacks
              ? feedbacks.map(d => (
                  <div key={d.created}>
                    <div
                      className="list-group-item list-group-item-action progress-bar"
                      // role="progressbar"
                      // aria-valuenow="75"
                      aria-valuemin="0"
                      aria-valuemax="100"
                      data-toggle="collapse"
                      href={"#col_" + d.created}
                      // aria-expanded="false"
                      aria-controls="collapseExample"
                    >
                      <b>{d.userLogin}:</b> "{d.comment}"{" "}
                      <div
                        style={{
                          float: "right",
                          margin: "0 auto 0 auto"
                        }}
                      >
                        <span
                          name="Like"
                          onClick={() => this.like(d)}
                          style={{ cursor: "pointer" }}
                        >
                          <FaThumbsUp
                            color={
                              (color === 1 &&
                                feedback &&
                                feedback.feedbackId) === d.feedbackId
                                ? "green"
                                : ""
                            }
                          />
                        </span>{" "}
                        <b> {d.rating} </b>{" "}
                        <span
                          onClick={() => this.dislike(d)}
                          style={{ cursor: "pointer" }}
                        >
                          <FaThumbsDown
                            color={
                              (color === -1 &&
                                feedback &&
                                feedback.feedbackId) === d.feedbackId
                                ? "red"
                                : ""
                            }
                          />
                        </span>
                      </div>
                    </div>
                    <div className="collapse" id={"col_" + d.created}>
                      <div className="card card-body">
                        {Object.keys(d).map(attr => (
                          <div key={attr}>
                            {" "}
                            <b>{attr}:</b> {d[attr]} <br />{" "}
                          </div>
                        ))}
                        <Link to={"/feedback" + "/" + d.created} id={d.created}>
                          More about "{d.userLogin}"
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              : ""}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Discipline;
