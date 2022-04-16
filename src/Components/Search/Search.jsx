import React, { Component } from "react";
import "./search.css";
export default class Search extends Component {
  render() {
    return (
      <div className="search">
        <div className="search-buttons">
          <button className="search-button active">Search</button>
          <button className="rated-button">Rated</button>
        </div>
        <input
          type="text"
          className="search-movies"
          placeholder="Type to search..."
        />
      </div>
    );
  }
}
