import React, { Component } from "react";
import Feedback from "./Feedback";
class Feedbacks extends Component {
  state = {};
  render() {
    const { feedbacks, liked, disliked, like } = this.props;
    return (
      <div style={{ margin: "100px auto 0 auto" }} className="userList col-10">
        <h4>Feedbacks</h4>
        {feedbacks
          ? feedbacks.map(d => (
              <Feedback
                key={JSON.stringify(d)}
                d={d}
                liked={liked}
                disliked={disliked}
                like={like}
              />
            ))
          : ""}
      </div>
    );
  }
}

export default Feedbacks;
