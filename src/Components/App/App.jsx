import React, { Component } from "react";
import Movie from "../Movie";
import MovieList from "../MovieList";
import Search from "../Search";
import "./app.css";
import { Pagination } from "antd";
export default class App extends Component {
  render() {
    return (
      <div className="wrapper">
        <Search></Search>
        <MovieList></MovieList>
        <Movie></Movie>
        <Pagination total={500}></Pagination>
      </div>
    );
  }
}
