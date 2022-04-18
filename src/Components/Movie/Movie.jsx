import React, { Component } from "react";
import "./movie.css";
import { Spin } from "antd";

export default class Movie extends Component {
  render() {
    const { content, loading } = this.props;
    const cardContent = loading ? (
      <Spin tip="loading..." />
    ) : (
      <MovieCardContent content={content} />
    );

    return <div className="movie-card">{cardContent}</div>;
  }
}

const MovieCardContent = ({ content }) => {
  const { title, date, description, poster } = content;
  return (
    <React.Fragment>
      <img
        src={`https://image.tmdb.org/t/p/original${poster}`}
        alt="Movie poster"
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
