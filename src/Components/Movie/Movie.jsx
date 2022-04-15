import React, { Component } from "react";
import "./movie.css";
import swapiService from "../../services/swapiService";

export default class Movie extends Component {
  state = {
    title: null,
    date: null,
    genres: null,
    description: null,
    poster: null,
  };

  componentDidMount() {
    this.searchMovies();
  }

  searchMovies() {
    const swapi = new swapiService();
    swapi.searchMovies().then((result) => {
      console.log(result);
      const { title, overview, release_date, poster_path } = result.results[0];
      this.setState({
        title,
        date: release_date,
        genres: null,
        description: overview,
        poster: poster_path,
      });
    });
  }

  render() {
    const { title, date, genres, description, poster } = this.state;

    return (
      <div className="movie-card">
        <img
          src={`https://image.tmdb.org/t/p/original${poster}`}
          alt="Movie"
          className="movie-img"
        />
        <div className="movie-info">
          <h5 className="movie-title">{title}</h5>
          <p className="movie-date">{date}</p>
          <div className="movie-genres">
            <button className="movie-genre">Action</button>
            <button className="movie-genre">Drama</button>
          </div>
          <p className="movie-description">{description}</p>
        </div>
      </div>
    );
  }
}
