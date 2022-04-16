import React, { Component } from "react";
import "./movie.css";
import swapiService from "../../services/swapiService";
import { Spin, Alert } from "antd";

export default class Movie extends Component {
  state = {
    content: {
      title: null,
      date: null,
      genres: null,
      description: null,
      poster: null,
    },
    error: false,
    loading: true,
  };

  onError() {
    this.setState({ error: true, loading: false });
  }

  componentDidMount() {
    this.searchMovies();
  }

  searchMovies() {
    const swapi = new swapiService();
    swapi
      .searchMovies()
      .then((result) => {
        const { title, overview, release_date, poster_path } =
          result.results[0];
        this.setState({
          content: {
            title,
            date: release_date,
            genres: null,
            description: overview,
            poster: poster_path,
          },
          loading: false,
        });
      })
      .catch(() => {
        this.onError();
      });
  }

  render() {
    const { content, loading, error } = this.state;

    const hasData = !(loading || error);
    const errorMessage = error ? <Alert message="Error" type="error" /> : null;
    const spin = loading ? <Spin tip="loading..." /> : null;
    const cardContent = hasData ? <MovieCardContent content={content} /> : null;

    return (
      <div className="movie-card">
        {errorMessage}
        {spin}
        {cardContent}
      </div>
    );
  }
}

const MovieCardContent = ({ content }) => {
  const { title, date, genres, description, poster } = content;
  return (
    <React.Fragment>
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
    </React.Fragment>
  );
};
