import React, { Component } from "react";

class SettingsProfessions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      professionId: 0,
      professions: []
    };
  }
  componentDidMount() {
    this.getProfessions();
  }
  setNewId = p => {
    const professionId = this.state.professions.find(
      a => a.name === p.target.value
    )["id"];
    this.props.setProfession(professionId);
  };
  selectedProfessionComp = () => (
    <select className="form-control" onChange={this.props.setProfession}>
      {Object.keys(this.state.professions).map(k => (
        <option className="dropdown-item" key={k}>
          {this.state.professions[k].name}
        </option>
      ))}
    </select>
  );
  getProfessions = () => {
    var url = `${this.props.link}/profession`;

    fetch(url, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    })
      .then(res => res.json())
      .then(data => this.setState({ professions: data.profession }))
      .catch(console.error);
  };
  notSelectedProfessionComp = () => (
    <select className="form-control" onChange={this.setNewId}>
      <option className="dropdown-item" key={1} defaultValue hidden>
        Profession not set
      </option>
    </select>
  );

  proffs = () => {
    const { professions } = this.state;
    const isDisplayable = !this.isAdmin && professions;

    if (isDisplayable) return this.selectedProfessionComp();
    if (professions) return this.notSelectedProfessionComp();
    return null;
  };
  render() {
    return <div>{this.proffs()}</div>;
  }
}

export default SettingsProfessions;
