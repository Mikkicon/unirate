import React, { Component } from "react";
import "../../Styles/Progress.css";
class Progress extends Component {
  state = {
    feedbacks: [],
    link: this.props.testnet
      ? "http://localhost:3000"
      : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
    total: 0,
    grades: [],
    canvasHeight: 0,
    canvasWidth: 0,
    xTopOffset: 150,
    yLeftOffset: 10,
    fontSize: 10,
    gradesAmount: 5,
    verticalScaleInterval: 30,
    nameDisciplineOffset: 160,
    markDisciplineOffset: 170,
    lowestMark: 60
  };
  componentDidMount = async () => {
    this.getData();
  };
  componentDidUpdate = async () => {
    this.drawCanvasContent();
  };

  fillMarksScale = ctx => {
    const { gradesAmount, verticalScaleInterval, yLeftOffset } = this.state;
    for (var i = 0; i < gradesAmount; i++) {
      var coeficient = i * 10;
      ctx.fillText(
        `${100 - coeficient}`,
        yLeftOffset,
        10 + i * verticalScaleInterval
      );
    }

    return ctx;
  };

  setupCanvas = async canvas => {
    // adjust scale as to DPR
    var ctx = canvas.getContext("2d");
    var dpr = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();
    const width = rect.width * dpr;
    const height = rect.height * dpr;

    canvas.width = width;
    canvas.height = height;
    ctx.scale(dpr, dpr);
    ctx.lineWidth = 2;
    const { xTopOffset, yLeftOffset, fontSize } = this.state;

    // y coords line
    ctx.moveTo(yLeftOffset, 0);
    ctx.lineTo(yLeftOffset, canvas.height);

    // x coords line
    ctx.moveTo(0, xTopOffset);
    ctx.lineTo(canvas.width, xTopOffset);
    ctx.font = `${fontSize}px Arial`;
    var ctxWithMarks = this.fillMarksScale(ctx);
    return ctxWithMarks;
  };

  drawCanvasContent = async () => {
    const canvas = document.getElementById("myCanvas");
    var ctx = await this.setupCanvas(canvas);

    const {
      grades,
      nameDisciplineOffset,
      markDisciplineOffset,
      feedbacks,
      verticalScaleInterval,
      lowestMark
    } = this.state;
    var interval = Math.floor(
      (Math.floor(canvas.width / 2) / grades.length) * 0.8
    );
    console.log(interval);

    for (var i = 1; i < grades.length; i++) {
      console.log(i, "---", Math.floor((grades[i][0] % 60) / 10) * 20);
      var currentX = i * interval;
      const { disciplineName, disciplineYear } = feedbacks[i - 1];

      ctx.fillText(disciplineName, currentX, nameDisciplineOffset);
      ctx.fillText(disciplineYear, currentX, markDisciplineOffset);
      ctx.moveTo(
        currentX,
        125 -
          Math.floor((grades[i - 1][0] % lowestMark) / 10) *
            verticalScaleInterval
      );
      ctx.lineTo(
        currentX + interval,
        125 -
          Math.floor((grades[i][0] % lowestMark) / 10) * verticalScaleInterval
      );
    }
    const { disciplineName } = feedbacks[feedbacks.length - 1];
    ctx.fillText(
      disciplineName,
      feedbacks.length * interval,
      nameDisciplineOffset
    );
    ctx.fillText(
      feedbacks[feedbacks.length - 1].disciplineYear,
      feedbacks.length * interval,
      markDisciplineOffset
    );
    ctx.stroke();
  };

  getData = async () => {
    const login = localStorage.getItem("login");
    var rawResponse = await fetch(
      `${this.state.link}/${
        window.localStorage.getItem("admin").includes(true) ? "admin/" : ""
      }feedback?user_login=${login}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    );
    const response = await rawResponse.json();
    var feedbacks = response.feedback;
    var grades = [];
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
