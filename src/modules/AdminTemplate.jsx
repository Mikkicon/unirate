import React, { Component } from "react";
import "../Styles/Admin.css";
import "bootstrap";
import Pagination from "react-bootstrap/Pagination";
import Filter from "./Filter";
import Toolbar from "./Toolbar";
import AdminMenu from "./AdminMenu";
import UserList from "./UserList";
import UserView from "./UserView";

class AdminTemplate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      link: this.props.testnet
        ? "http://localhost:3000"
        : "http://disciplinerate-env.aag5tvekef.us-east-1.elasticbeanstalk.com",
      entities: [],
      total: 0,
      selectedItem: null,
      selectedEntity: "discipline",
      post: false,
      faculties: [],
      professions: [],
      response: "",
      query: {},
      theme: false,
      attributes: {
        feedback: {
          attributes: [
            "userLogin",
            "studentGrade",
            "rating",
            "comment",
            "disciplineName",
            "teachers",
            "created"
          ],
          buttons: ["DELETE"],
          editable: []
        },
        user: {
          attributes: [
            "email",
            "rating",
            "role",
            "professionName",
            "totalFeedbackNumber"
          ],
          buttons: ["SAVE", "DELETE"],
          editable: ["role"]
        },
        teacher: {
          attributes: ["lastName", "name", "middleName", "feedbackNumber"],
          buttons: ["SAVE", "DELETE"],
          editable: ["lastName", "name", "middleName"]
        },
        discipline: {
          attributes: ["name", "year", "facultyName"],
          buttons: ["SAVE", "DELETE", "POST"],
          editable: ["name", "year", "facultyName"]
        },
        faculty: {
          attributes: ["name", "shortName"],
          buttons: ["SAVE", "DELETE", "POST"],
          editable: ["name", "shortName"]
        },
        profession: {
          attributes: ["name", "facultyName"],
          buttons: ["SAVE", "DELETE", "POST"],
          editable: ["name", "facultyName"]
        }
      }
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
      selectedItem: state.entities.find(
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

  entityAction = async (method, query) => {
    const { link, selectedItem, selectedEntity } = this.state;
    let body =
      method === "PUT" || method === "POST" ? JSON.stringify(query) : "";
    console.log(method, query);
    console.log(body);
    console.log(
      `${link}/admin/${selectedEntity}/${
        method !== "POST" ? selectedItem[Object.keys(selectedItem)[0]] : ""
      }`
    );

    window.confirm(`Are you sure you want to ${method + selectedEntity} ?`)
      ? fetch(
          `${link}/admin/${selectedEntity}/${
            method !== "POST" ? selectedItem[Object.keys(selectedItem)[0]] : ""
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
          .then(res => console.log(res))
          .catch(err => console.log("Error: ", err))
      : console.log("canceled");
    this.search("");
  };
  search = async input => {
    const { link, selectedEntity } = this.state;
    var query = Object.keys(input).reduce(
      (total, current) => total + current + "=" + input[current] + "&",
      ""
    );
    query = query ? "?" + query.slice(0, -1) : "";
    console.log("Search params:", query ? query : "discipline");

    let searchRaw = await fetch(
      `${link}/admin/${selectedEntity}/${input ? query : ""}`,
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
          entities: searchData[selectedEntity]
            ? searchData[selectedEntity]
            : [],
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
      selectedItem: objCopy,
      entities: entitiesCopy,
      post: true
    });
  };
  setTheme = a => {
    this.setState({ theme: a });
  };
  selectEntity = a => {
    this.setState({ selectedEntity: a }, () => this.search(""));
  };
  render() {
    const {
      entities,
      total,
      selectedItem,
      selectedEntity,
      faculties,
      theme,
      link,
      post,
      query,
      attributes
    } = this.state;

    return (
      <React.Fragment>
        <div style={{ margin: "auto" }} className="col-11 row">
          <div className="row">
            <br />
            <br />
            <div className={theme ? "userListBlack col-6" : "userList col-6"}>
              <Toolbar
                selectedEntity={selectedEntity}
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
            <AdminMenu
              selectEntity={this.selectEntity}
              toggle={true}
              theme={theme}
            />
          </div>
          <UserList
            selectDiscipline={this.selectDiscipline}
            entities={entities}
            pages={this.pages}
            theme={theme}
            search={this.search}
            total={total}
            selectedEntity={selectedEntity}
          />
          <UserView
            theme={theme}
            attributes={attributes[selectedEntity]}
            selectedEntity={selectedEntity}
            selectedItem={selectedItem}
            faculties={faculties}
            post={post}
            query={query}
            addNew={this.addNew}
            putEntity={this.putEntity}
            postEntity={this.postEntity}
            entityAction={this.entityAction}
          />
        </div>
        <br />
        <br />
      </React.Fragment>
    );
  }
}

export default AdminTemplate;
