import React, { Component } from 'react'
import './movie.css'
import { Spin, Rate } from 'antd'

import tmdbService from '../../services/tmdbService'

export default class Movie extends Component {
  ids = 0
  RenderGenres(genres = []) {
    return genres.map((genre) => {
      return (
        <button className="movie-genre" key={this.ids++}>
          {genre}
        </button>
      )
    })
  }

  calculateDate(date) {
    return new Date(date).toLocaleString('en-us', {
      month: 'long',
      year: 'numeric',
      day: 'numeric',
    })
  }

  onRateClick = (value) => {
    const tmdb = new tmdbService()

    const { movieId, sessionId, onError } = this.props

    if (value) {
      tmdb.rateMovie(movieId, sessionId, value).catch((error) => {
        onError(error.message)
      })
    }
  }

  renderMovie = () => {
    const { content, genres } = this.props
    const { title, date, description, poster, averageVote, borderColor, rating } = content

    return (
      <React.Fragment>
        <img src={`https://image.tmdb.org/t/p/original${poster}`} alt="Movie poster" className="movie-img" />
        <div className="movie-info">
          <div className="movie-header">
            <h5 className="movie-title">{title}</h5>
            <p className="average-vote" style={{ border: `2px solid ${borderColor}` }}>
              {averageVote}
            </p>
          </div>
          <p className="movie-date">{this.calculateDate(date)}</p>
          <div className="movie-genres">{this.RenderGenres(genres)}</div>

          <p className="movie-description">{description}</p>
          <div className="rate-container">
            <Rate
              count={10}
              allowClear={true}
              allowHalf={true}
              className="movie-rate"
              defaultValue={rating}
              onChange={this.onRateClick}
            ></Rate>
          </div>
        </div>
      </React.Fragment>
    )
  }

  render() {
    const { loading } = this.props
    const spin = (
      <div className="movie-spin">
        <Spin tip="loading..." />
      </div>
    )
    const cardContent = loading ? spin : this.renderMovie()

    return <div className="movie-card">{cardContent}</div>
  }
}
