import React, { Component } from "react";
import "../../Styles/Progress.css";
class Progress extends Component {
  state = {
    feedbacks: [],
    link: this.props.testnet
      ? "http://localhost:3000"
      : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
    total: 0,
    grades: []
  };
  componentDidMount = async () => {
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
    ctx.lineWidth = 2;
    // y coords line
    ctx.moveTo(10, 0);
    ctx.lineTo(10, canvas.height);
    // x coords line
    ctx.moveTo(0, 150);
    ctx.lineTo(canvas.width, 150);
    ctx.font = "10px Arial";
    ctx.fillText("100", 10, 10); //110 - 100
    ctx.fillText("90", 10, 40); //130 - 90
    ctx.fillText("80", 10, 70); //150 - 80
    ctx.fillText("70", 10, 100); //170 - 70
    ctx.fillText("60", 10, 130); //190 - 60
    return ctx;
  };
  drawCanvasContent = async () => {
    const canvas = document.getElementById("myCanvas");
    var ctx = await this.setupCanvas(canvas);

    let grades = this.state.grades;
    let interval = Math.floor(
      (Math.floor(canvas.width / 2) / grades.length) * 0.8
    );
    console.log(interval);

    for (let i = 1; i < grades.length; i++) {
      console.log(i, "---", Math.floor((grades[i][0] % 60) / 10) * 20);
      ctx.fillText(
        this.state.feedbacks[i - 1].disciplineName,
        i * interval,
        160
      );
      ctx.fillText(
        this.state.feedbacks[i - 1].disciplineYear,
        i * interval,
        170
      );
      ctx.moveTo(
        i * interval,
        125 - Math.floor((grades[i - 1][0] % 60) / 10) * 30
      );
      ctx.lineTo(
        i * interval + interval,
        125 - Math.floor((grades[i][0] % 60) / 10) * 30
      );
    }
    ctx.fillText(
      this.state.feedbacks[this.state.feedbacks.length - 1].disciplineName,
      this.state.feedbacks.length * interval,
      160
    );
    ctx.fillText(
      this.state.feedbacks[this.state.feedbacks.length - 1].disciplineYear,
      this.state.feedbacks.length * interval,
      170
    );
    ctx.stroke();
  };

  getData = async () => {
    var rawResponse = await fetch(
      `${this.state.link}/${
        window.localStorage.getItem("admin").includes(true) ? "admin/" : ""
      }feedback?user_login=${localStorage.getItem("login")}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    );
    const response = await rawResponse.json();
    let feedbacks = response.feedback;
    let grades = [];
    feedbacks.sort((a, b) => a.disciplineYear - b.disciplineYear);
    console.log(feedbacks);
    feedbacks.map(feedback =>
      grades.push([
        feedback.studentGrade,
        String(feedback.disciplineName + " " + feedback.disciplineYear)
      ])
    );
    this.setState({ grades, feedbacks });
  };

  render() {
    return (
      <div>
        <canvas
          style={{ width: "400px", height: "180px", border: "2px dashed blue" }}
          id="myCanvas"
        >
          Your browser does not support the HTML5 canvas tag.
        </canvas>
      </div>
    );
  }
}

export default Progress;
