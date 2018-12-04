import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import Gear from "./gear.js";
import "bootstrap/dist/css/bootstrap.min.css";

const routing = (
  <Router>
    <div>
      <Gear />
    </div>
  </Router>
);

ReactDOM.render(routing, document.getElementById("root"));
