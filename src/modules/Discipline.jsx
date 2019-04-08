import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FaThumbsUp, FaThumbsDown, FaBuilding, FaClock } from "react-icons/fa";
import { Button } from "react-bootstrap";
import "../Styles/Admin.css";
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
      feedbacks: null,
      faculties: null,
      // POST feedback/:disciplineId
      // Path: *discipline id
      // Body: studentGrade, comment, teachersIds: [number];
      newFeedback: {}
    };
  }
  getFacNames = async () => {
    const a = await fetch(`${this.state.link}/faculty`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    const b = await a.json();
    this.setState({ faculties: b.faculty });
  };
  componentDidMount = () => {
    this.loadEntities();
    this.getFacNames();
  };
  post = () => {
    const { newFeedback, discipline } = this.state;
    console.log(newFeedback);
    if (
      !newFeedback.comment ||
      !newFeedback.teachersIds ||
      !newFeedback.studentGrade
    ) {
      console.log("Missing required fields");
    } else {
      fetch(
        `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/feedback/${
          discipline.id
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          body: JSON.stringify(newFeedback)
        }
      )
        .then(res =>
          res.status.toString()[0] === 2
            ? console.log("Liked")
            : console.log("Error: ", res.statusText)
        )
        .then(() => this.loadEntities())
        .catch(err => console.log(err));
    }
  };
  loadEntities = () => {
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
      .catch(err => console.log(err));
  };
  like = async (e, signum) => {
    fetch(
      `http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com/feedback/grade/${
        e.feedbackId
      }`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify({ like: signum })
      }
    )
      .then(res =>
        res.status.toString()[0] === 2
          ? console.log("Liked")
          : console.log("Error: ", res.statusText)
      )
      .then(() => this.loadEntities())
      .catch(err => console.log(err));
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
    const { discipline, feedback, color, feedbacks, faculties } = this.state;

    return (
      <React.Fragment>
        <div style={{ margin: "0 auto 0 auto" }} className=" col-10">
          <h1>
            <b>{discipline[Object.keys(discipline)[1]]} </b>
          </h1>
          <div style={{ margin: "auto" }}>
            <h2>
              <p style={{ float: "left" }}>
                <FaClock /> {discipline[Object.keys(discipline)[2]]} YEAR
              </p>
              <p style={{ float: "right" }}>
                <FaBuilding />
                {faculties
                  ? faculties.find(a => a.id === discipline.facultyId)
                    ? faculties
                        .find(a => a.id === discipline.facultyId)
                        .name.toUpperCase()
                    : ""
                  : null}
              </p>
            </h2>
          </div>
          <br />
          <div
            style={{ margin: "100px auto 0 auto" }}
            className="userList col-10"
          >
            <h4>Feedbacks</h4>
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
                          onClick={() => this.like(d, 1)}
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
                          onClick={() => this.like(d, -1)}
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
                        {Object.keys(d)
                          .filter(
                            f =>
                              f !== "userLogin" &&
                              f !== "studentGrade" &&
                              f !== "rating" &&
                              f.indexOf("Id") === -1
                          )
                          .map(attr =>
                            attr !== "created" ? (
                              <div key={attr}>
                                {" "}
                                <b>{attr}:</b> {d[attr]} <br />{" "}
                              </div>
                            ) : (
                              <div key={attr}>
                                {" "}
                                <b>{attr}:</b>{" "}
                                {Date(
                                  Number(d["created"]) * 1000
                                ).toLocaleString()}{" "}
                                <br />{" "}
                              </div>
                            )
                          )}
                        <Link to={"/feedback" + "/" + d.created} id={d.created}>
                          More about "{d.userLogin}"
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              : ""}
          </div>
          <div className="userList">
            <div>
              <input
                className="list-group-item list-group-item-action"
                type="number"
                placeholder="My teacher was: "
                onChange={p => {
                  let state = this.state.newFeedback;
                  state["teachersIds"] = [Number(p.target.value)];
                  this.setState({ newFeedback: state });
                }}
              />
              <br />
              <input
                className="list-group-item list-group-item-action"
                type="number"
                placeholder="My mark was..."
                onChange={p => {
                  let state = this.state.newFeedback;
                  state["studentGrade"] = Number(p.target.value);
                  this.setState({ newFeedback: state });
                }}
              />
              <br />
              <input
                className="list-group-item list-group-item-action"
                type="text"
                placeholder="WOW! Such discipline..."
                onChange={p => {
                  let state = this.state.newFeedback;
                  state["comment"] = p.target.value;
                  this.setState({ newFeedback: state });
                }}
              />
              <br />
              <button
                onClick={() => this.post()}
                className="btn btn-outline-success"
                style={{ margin: 0, width: "100%" }}
              >
                Post!
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Discipline;
