import React, { Component } from "react";
import "../../Styles/Admin.css";
import "bootstrap";
import Pagination from "react-bootstrap/Pagination";
import Filter from "../Filter";
import Toolbar from "../Toolbar";
import AdminMenu from "../AdminMenu";
import UserList from "../UserList";
import UserView from "../UserView";

class AdminDiscipline extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      entities: [],
      page: 1,
      total: null,
      selectedDiscipline: null,
      post: false,
      newEntity: null,
      faculties: null,
      professions: null,
      response: null,
      query: null,
      theme: false
    };
  }
  componentDidMount() {
    this.search("");
    this.getFacProfNames();
  }
  getFacProfNames = async () => {
    const { link } = this.state;
    this.setState({ query: {} });
    let rawfac = await fetch(`${link}/admin/faculty`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    let datafac = await rawfac.json();
    let rawprof = await fetch(`${link}/admin/profession`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token")
      }
    });
    let dataprof = rawprof.json();
    this.setState({
      professions: dataprof.profession,
      faculties: datafac.faculty
    });
  };
  selectDiscipline = p => {
    const t = p.target.id;
    if (this.state.post) {
      this.setState(state => ({ entities: state.entities.slice(1) }));
    }
    this.setState(state => ({
      selectedDiscipline: state.entities.find(
        a => a[Object.keys(a)[0]].toString() === t
      ),
      post: false
    }));
  };
  pages = () => {
    let array = [];
    for (
      let i = 1;
      i < Math.floor(this.state.entities ? this.state.total / 10 : 0) + 2;
      i++
    ) {
      array.push(
        <Pagination.Item
          onClick={() => this.search({ offset: (i - 1) * 10 })}
          key={i}
          id={i}
        >
          {i}
        </Pagination.Item>
      );
    }
    return array;
  };

  entityAction = async method => {
    const { link, selectedDiscipline, query } = this.state;
    let body =
      method === "PUT"
        ? JSON.stringify(query)
        : method === "POST"
        ? JSON.stringify({
            name: selectedDiscipline["name"],
            year: Number(selectedDiscipline["year"]),
            facultyId: selectedDiscipline["facultyId"]
          })
        : "";
    console.log(body);

    window.confirm(`Are you sure you want to ${method} discipline?`)
      ? fetch(
          `${link}/admin/discipline/${
            method !== "POST"
              ? selectedDiscipline[Object.keys(selectedDiscipline)[0]]
              : ""
          }`,
          {
            method: method,
            body: method === "DELETE" ? null : body,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token")
            }
          }
        )
          .then(res => this.setState({ response: res.statusText }))
          .catch(err => console.log("Error: ", err))
      : console.log("canceled");
    this.search("");
  };
  search = async input => {
    var query = Object.keys(input).reduce(
      (total, current) => total + current + "=" + input[current] + "&",
      ""
    );
    query = query ? "?" + query.slice(0, -1) : "";
    console.log("Search params:", query ? query : "discipline");

    let searchRaw = await fetch(
      `${this.state.link}/admin/discipline/${input ? query : ""}`,
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      }
    );
    let searchData = await searchRaw.json();

    searchData.total
      ? this.setState({
          entities: searchData["discipline"] ? searchData["discipline"] : [],
          total: searchData.total
        })
      : this.setState({ entities: [], total: 0 });
  };

  addNew = () => {
    let entitiesCopy = this.state.entities;
    let objCopy = {};
    let key;
    for (key in entitiesCopy[0]) {
      objCopy[key] = "";
    }

    entitiesCopy.unshift(objCopy);

    this.getFacProfNames();
    this.setState({
      selectedDiscipline: objCopy,
      entities: entitiesCopy,
      post: true
    });
  };
  setTheme = a => {
    this.setState({ theme: a });
  };
  render() {
    const {
      entities,
      total,
      selectedDiscipline,
      faculties,
      theme,
      link,
      post,
      query
    } = this.state;

    return (
      <React.Fragment>
        <div style={{ margin: "auto" }} className="col-11 row">
          <div className="row">
            <br />
            <br />
            <div className={theme ? "userListBlack col-6" : "userList col-6"}>
              <Toolbar
                selected="discipline"
                theme={theme}
                select={null}
                search={this.search}
                entities={entities}
                setTheme={this.setTheme}
                total={total}
              />
              <Filter
                faculties={faculties}
                link={link}
                admin={true}
                search={this.search}
                theme={theme}
                options={["faculty", "year", "mandatoryProfessionId"]}
              />
            </div>
            <AdminMenu theme={theme} />
          </div>
          <UserList
            selectDiscipline={this.selectDiscipline}
            entities={entities}
            pages={this.pages}
            theme={theme}
            search={this.search}
            total={total}
          />

          <UserView
            theme={theme}
            attributes={{
              attributes: ["name", "year", "facultyName"],
              buttons: ["SAVE", "DELETE", "POST"]
            }}
            selectedEntity={"discipline"}
            selectedItem={selectedDiscipline}
            faculties={faculties}
            post={post}
            query={query}
            addNew={this.addNew}
            putEntity={this.putEntity}
            postEntity={this.postEntity}
            entityAction={this.entityAction}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default AdminDiscipline;
