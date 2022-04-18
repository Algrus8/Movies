import React, { Component } from "react";
import Movie from "../Movie";
import "./movie-list.css";
export default class MovieList extends Component {
  prettieDescription = (string) => {
    let arr = string.split(" ");
    return arr.length > 30 ? `${arr.slice(0, 30).join(" ")}...` : string;
  };

  renderMovies = () => {
    const { movies, loading } = this.props;

    if (!movies) {
      return null;
    }

    return movies.map((movie) => {
      const { release_date, title, overview, poster_path, id } = movie;

      const content = {
        title,
        date: release_date,
        genres: null,
        description: this.prettieDescription(overview),
        poster: poster_path,
      };
      return (
        <Movie
          content={content}
          key={id}
          loading={loading}
         
        ></Movie>
      );
    });
  };

  render() {
    return <div className="movie-list">{this.renderMovies()}</div>;
  }
}
