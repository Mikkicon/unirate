import React, { Component } from "react";
import { FaBuilding, FaClock } from "react-icons/fa";
import "../../Styles/Admin.css";
import NewFeedback from "../Components/NewFeedback";
import Feedbacks from "./Feedbacks";
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
      feedbacks: [],
      teachers: [],
      teacher: null,
      faculties: null,
      liked: [],
      disliked: [],
      newFeedback: {}
    };
  }
  getFacNames = () => {
    fetch(`${this.state.link}/teacher`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(d => d.json())
      .then(c => this.setState({ teachers: c.teacher }));
  };
  componentDidMount = () => {
    this.loadEntities();
    this.getFacNames();
  };
  post = async newFeedback => {
    const { discipline } = this.state;
    console.log(newFeedback);
    if (!newFeedback.comment || !newFeedback.studentGrade) {
      console.log("Missing required fields");
    } else {
      fetch(`${this.state.link}/feedback/${discipline.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=utf-8",

          Authorization: "Bearer " + localStorage.getItem("token")
        },
        body: JSON.stringify(newFeedback)
      })
        .then(res =>
          res.status.toString()[0] === 2
            ? console.log("Liked")
            : console.log("Error: ", res.statusText)
        )
        .then(() => this.loadEntities())
        .catch(err => console.log(err));
    }
    this.loadEntities();
  };
  deleteFeedback = feedback => {
    if (feedback["userLogin"] !== localStorage.getItem("login")) {
      console.log("You can not delete this");
    } else {
      fetch(`${this.state.link}/feedback/${this.state.newFeedback.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      })
        .then(() => this.loadEntities())
        .catch(err => console.log(err));
    }
  };
  loadEntities = async () => {
    var rawResult = await fetch(
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
    );
    const result = await rawResult.json();
    this.setState({ discipline: result.discipline[0] });

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
  like = (e, signum) => {
    this.setState(state =>
      signum > 0
        ? {
            disliked: state.disliked.filter(f => f !== e["feedbackId"]),
            liked: [...state.liked, e["feedbackId"]]
          }
        : {
            liked: state.liked.filter(f => f !== e["feedbackId"]),
            disliked: [...state.disliked, e["feedbackId"]]
          }
    );
    fetch(`${this.state.link}/feedback/grade/${e.feedbackId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      },
      body: JSON.stringify({ like: signum })
    })
      .then(res =>
        res.status.toString()[0] === 2
          ? console.log("Liked")
          : console.log("Error: ", res.statusText)
      )
      .then(() => this.loadEntities())
      .catch(err => console.log(err));
  };
  render() {
    const {
      discipline,
      feedbacks,
      liked,
      disliked,
      newFeedback,
      teachers
    } = this.state;

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
                {discipline["facultyName"]}
              </p>
            </h2>
          </div>
          <br />
          <Feedbacks
            feedbacks={feedbacks}
            liked={liked}
            disliked={disliked}
            like={this.like}
          />
          <NewFeedback
            newFeedback={newFeedback}
            post={this.post}
            teachers={teachers}
          />
          <br />
          <br />
        </div>
      </React.Fragment>
    );
  }
}

export default Discipline;
