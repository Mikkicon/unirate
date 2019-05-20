import React, { Component } from "react";
import "../Styles/Progress.css";
class Progress extends Component {
  state = {
    feedbacks: [],
    link: this.props.testnet
      ? "http://localhost:3000"
      : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
    total: 0,
    grades: []
  };
  componentDidMount = () => {
    this.getData();
  };
  componentDidUpdate = async () => {
    this.drawCanvasContent();
  };
  setupCanvas = async canvas => {
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    var ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    return ctx;
  };
  drawCanvasContent = async () => {
    const canvas = document.getElementById("myCanvas");
    var ctx = await this.setupCanvas(canvas);
    ctx.lineWidth = 2;
    // y coords line
    ctx.moveTo(10, 0);
    ctx.lineTo(10, canvas.height);
    // x coords line
    ctx.moveTo(0, 90);
    ctx.lineTo(canvas.width, 90);
    let grades = this.state.grades;
    for (let i = 0; i < grades.length - 1; i++) {
      console.log(grades[i][0], grades[i][1]);

      ctx.moveTo(grades[i][0], grades[i][1] * 10);
      ctx.lineTo(grades[i + 1][0], grades[i + 1][1] * 10);
    }
    ctx.stroke();
  };

  getData = async () => {
    var rawResponse = await fetch(
      `${this.state.link}/feedback?user_login=${localStorage.getItem("login")}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    );
    const response = await rawResponse.json();
    let grades = [];
    response.feedback.map(feedback =>
      grades.push([feedback.studentGrade, feedback.disciplineYear])
    );
    response.total
      ? this.setState(state => ({
          feedbacks: response["feedback"]
            ? response["feedback"]
            : state.feedbacks,
          total: response.total,
          grades
        }))
      : this.setState({ feedbacks: [], total: 0 });
  };

  render() {
    return (
      <div>
        <canvas className="col-12" id="myCanvas">
          Your browser does not support the HTML5 canvas tag.
        </canvas>
      </div>
    );
  }
}

export default Progress;
