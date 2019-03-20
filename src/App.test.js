import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import Registration from "./components/Registration";
import { act } from "react-dom/test-utils";
import ReactTestUtils from "react-dom/test-utils"; // ES6
import { getMaxListeners } from "cluster";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

let container;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it("render correctly input component", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Registration />, div);
  ReactDOM.unmountComponentAtNode(div);
});

test("should create account", () => {
  const createAccount = ReactTestUtils.renderIntoDocument(<Registration />);

  const [emailNode] = ReactTestUtils.findAllInRenderedTree(
    createAccount,
    el => el.name === "mail"
  );
  const [passwordNode] = ReactTestUtils.findAllInRenderedTree(
    createAccount,
    el => el.name === "pass"
  );
  const [confNode] = ReactTestUtils.findAllInRenderedTree(
    createAccount,
    el => el.name === "conf"
  );
  const [buttonNode] = ReactTestUtils.findAllInRenderedTree(
    createAccount,
    el => el.type === "submit"
  );

  emailNode.value = "mikkiconfdsa123@gmail.com";
  ReactTestUtils.Simulate.change(emailNode);

  passwordNode.value = "fdsa";
  ReactTestUtils.Simulate.change(passwordNode);

  confNode.value = "fdsa";
  ReactTestUtils.Simulate.change(confNode);

  ReactTestUtils.Simulate.click(buttonNode);
  const [label] = ReactTestUtils.scryRenderedDOMComponentsWithTag(
    createAccount,
    "h2"
  );
  expect(emailNode.textContent).toBe("mikkiconfdsa123@gmail.com");
  expect(label.textContent).toBe("Created");
});
