import React, { Component } from 'react'

import { GenresConsumer } from '../GenresContext/GenresContext'
import Movie from '../Movie'
import './movie-list.css'

export default class MovieList extends Component {
  prettieDescription = (string) => {
    return string.length > 150 ? `${string.slice(0, 150)}...` : string
  }

  calculateBorderColor(rate) {
    if (rate <= 3) {
      return '#E90000'
    }
    if (rate <= 5) {
      return '#E97E00'
    }
    if (rate <= 7) {
      return '#E9D100'
    } else {
      return '#66E900'
    }
  }

  translateGenres(allGenres, movieGenres) {
    return movieGenres.map((id) => {
      return allGenres.find((element) => element.id === id).name
    })
  }

  render() {
    const { movies, loading, sessionId, onError, onlyRated } = this.props

    if (!movies) {
      return null
    }
    const List = movies.map((movie) => {
      const { release_date: date, title, overview, poster_path: poster, id, genre_ids: genres, rating = null } = movie
      let { vote_average: averageVote } = movie
      const borderColor = this.calculateBorderColor(averageVote)

      if (averageVote % 1 === 0 && averageVote !== 10) {
        averageVote += '.0'
      }

      const content = {
        title,
        date,
        genres,
        description: this.prettieDescription(overview),
        poster,
        averageVote,
        borderColor,
        rating,
      }

      return (
        <GenresConsumer key={id}>
          {(allGenres) => {
            return (
              <Movie
                content={content}
                key={id}
                loading={loading}
                movieId={id}
                sessionId={sessionId}
                genres={this.translateGenres(allGenres, genres)}
                onError={onError}
                id={id}
                onlyRated={onlyRated}
              />
            )
          }}
        </GenresConsumer>
      )
    })

    return <div className="movie-list">{List}</div>
  }
}
