import React, { Component } from "react";
import { FaThumbsUp, FaThumbsDown } from "react-icons/fa";
import Time from "react-time";
class Feedback extends Component {
  state = {};
  render() {
    const { d, liked, disliked, like } = this.props;
    return (
      <div key={d.created}>
        <div
          className="list-group-item clearfix list-group-item-action"
          data-toggle="collapse"
          href={"#col_" + d.created}
          aria-controls="collapseExample"
        >
          <b>{d.userLogin}:</b> "{d.comment}"
          <div
            style={{
              float: "right",
              margin: "0 auto 0 auto"
            }}
          >
            <span
              name="Like"
              onClick={() => like(d, 1)}
              style={{ cursor: "pointer" }}
            >
              <FaThumbsUp
                color={liked.find(f => f === d["feedbackId"]) ? "green" : ""}
              />
            </span>
            <b> {d.rating} </b>
            <span onClick={() => like(d, -1)} style={{ cursor: "pointer" }}>
              <FaThumbsDown
                color={disliked.find(f => f === d["feedbackId"]) ? "red" : ""}
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
                  attr === "teachers" ? (
                    <div key={JSON.stringify(d[attr])}>
                      {d[attr].map(kk => (
                        <div key={JSON.stringify(kk)}>
                          {Object.keys(kk).map(kkk => (
                            <div key={kkk}>{kk[kkk]}</div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div key={attr}>
                      <b>{attr}:</b> {d[attr]} <br />
                    </div>
                  )
                ) : (
                  <div key={attr}>
                    <b>{attr}:</b>
                    {
                      <Time
                        value={Number(d["created"]) * 1000}
                        format="HH:mm DD/MM/YYYY"
                      />
                    }
                    <br />
                  </div>
                )
              )}
          </div>
        </div>
      </div>
    );
  }
}

export default Feedback;
