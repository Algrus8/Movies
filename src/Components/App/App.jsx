import React, { Component } from "react";
import Movie from "../Movie";
import "./app.css";

export default class App extends Component {
  render() {
    return (
      <div className="wrapper">
        <Movie></Movie>
        <Movie></Movie>
      </div>
    );
  }
}
