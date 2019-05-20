import React, { Component } from "react";
class NewFeedback extends Component {
  state = {
    newFeedback: {}
  };
  render() {
    const { teachers, post } = this.props;
    const { newFeedback } = this.state;
    return (
      <div className="userList">
        <div>
          <select
            className="form-control col-12"
            type="number"
            onChange={p => {
              p.persist();
              this.setState(state => ({
                newFeedback: {
                  ...state.newFeedback,
                  teachersIds: [Number(p.target.value)]
                }
              }));
            }}
          >
            <option defaultChecked={true} value={""}>
              Choose your teacher
            </option>
            {teachers
              ? teachers.map(teacher => (
                  <option key={teacher["id"]} value={teacher["id"]}>
                    {teacher["lastName"]} {teacher["name"]}{" "}
                    {teacher["middleName"]}
                  </option>
                ))
              : ""}
          </select>
          <br />
          <input
            className="list-group-item list-group-item-action"
            type="number"
            placeholder="My mark was..."
            onChange={p => {
              p.persist();
              this.setState(state => ({
                newFeedback: {
                  ...state.newFeedback,
                  studentGrade: Number(p.target.value)
                }
              }));
            }}
          />
          <br />
          <input
            className="list-group-item list-group-item-action"
            type="text"
            placeholder="WOW! Such discipline..."
            onChange={p => {
              p.persist();
              this.setState(state => ({
                newFeedback: {
                  ...state.newFeedback,
                  comment: p.target.value
                }
              }));
            }}
          />
          <br />
          <button
            disabled={!newFeedback["comment"] || !newFeedback["studentGrade"]}
            onClick={() => {
              this.setState({ newFeedback: {} });
              post(newFeedback);
            }}
            className="btn btn-outline-success"
            style={{ margin: 0, width: "100%" }}
          >
            Post!
          </button>
        </div>
      </div>
    );
  }
}

export default NewFeedback;
