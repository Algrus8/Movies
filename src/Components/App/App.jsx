import React, { PureComponent } from 'react'
import { Pagination, Alert } from 'antd'
import { Offline, Online } from 'react-detect-offline'

import MovieList from '../MovieList'
import Search from '../Search'
import './app.css'
import tmdbService from '../../services/tmdbService'
import { GenresProvider } from '../GenresContext/GenresContext'
export default class App extends PureComponent {
  constructor(props) {
    super()
    this.sessionId = props.sessionId
    this.genres = props.genres
  }
  state = {
    query: '',
    movies: [],
    loading: true,
    error: false,
    notFind: false,
    totalPages: null,
    currentPage: 1,
    onlyRated: false,
    ratedMovies: [],
    totalRatedPages: null,
    currentRatedPage: 1,
    errorMessage: 'Error',
  }

  onSearchChange = (query) => {
    this.setState({ query: query })
  }

  onError = (errorMessage) => {
    this.setState({ error: true, loading: false, errorMessage })
  }

  onPaginationChange = (pageNumber) => {
    const { onlyRated } = this.state
    if (onlyRated) {
      this.setState({ currentRatedPage: pageNumber })
    } else {
      this.setState({ currentPage: pageNumber })
    }
  }

  debounce = (fn, debounceTime) => {
    let timeOut
    return function (...args) {
      const functionCall = () => fn.apply(this, args)
      clearTimeout(timeOut)
      timeOut = setTimeout(functionCall, debounceTime)
    }
  }

  searchMovies = () => {
    const { query, currentPage } = this.state
    if (query) {
      const tmdb = new tmdbService()
      this.setState({ loading: true })
      tmdb
        .searchMovies(query, currentPage)
        .then((response) => {
          if (response.results.length === 0) {
            this.setState({ notFind: true })
          } else {
            const { results, total_pages, page } = response
            this.setState({
              movies: results,
              loading: false,
              notFind: false,
              totalPages: total_pages,
              currentPage: page,
            })
          }
        })
        .catch((error) => {
          this.onError(error.message)
        })
    }
  }

  searchRatedMovies = () => {
    const tmdb = new tmdbService()
    const { currentRatedPage } = this.state
    this.setState({ loading: true, onlyRated: true })
    tmdb
      .ratedMovies(this.sessionId, currentRatedPage)
      .then((response) => {
        const { results, total_pages } = response
        this.setState({
          ratedMovies: results,
          totalRatedPages: total_pages,
          loading: false,
        })
      })
      .catch((error) => {
        this.onError(error.message)
      })
  }

  showAllOrRated = (event) => {
    const rated = event.target.classList.contains('rated-button')
    if (rated) {
      this.searchRatedMovies()
    } else {
      this.setState({ onlyRated: false })
    }
  }

  RenderMovies = () => {
    const {
      movies,
      loading,
      error,
      notFind,
      totalPages,
      onlyRated,
      ratedMovies,
      totalRatedPages,
      currentRatedPage,
      currentPage,
    } = this.state
    const haveMovies = !notFind && !error && (movies.length || ratedMovies.length)
    if (!haveMovies) {
      return null
    }
    if (onlyRated && !ratedMovies.length) {
      return null
    }
    return (
      <React.Fragment>
        <MovieList
          movies={onlyRated ? ratedMovies : movies}
          loading={loading}
          sessionId={this.sessionId}
          onError={this.onError}
        />
        <Pagination
          current={onlyRated ? currentRatedPage : currentPage}
          onChange={this.onPaginationChange}
          pageSize="1"
          total={onlyRated ? totalRatedPages : totalPages}
          showSizeChanger={false}
        />
      </React.Fragment>
    )
  }

  RenderSearch = () => {
    const { onlyRated, error, query } = this.state
    if (error) {
      return null
    }
    return (
      <Search
        onSearchChange={this.onSearchChange}
        showAllOrRated={this.showAllOrRated}
        onlyRated={onlyRated}
        query={query}
      />
    )
  }

  debounceSearchMovies = this.debounce(this.searchMovies, 1000)

  componentDidUpdate = (prevProps, prevState) => {
    const { query, currentPage, currentRatedPage } = this.state

    if (query !== prevState.query || currentPage !== prevState.currentPage) {
      this.debounceSearchMovies()
    }
    if (prevState.currentRatedPage !== currentRatedPage) {
      this.searchRatedMovies()
    }
  }

  componentDidCatch() {
    this.setState({ error: true })
  }

  render() {
    const { error, query, notFind, errorMessage } = this.state
    const errorIndicator = error ? <Alert message={errorMessage} type="error" /> : null

    const find = notFind && query ? <div className="nothing-found">Nothing found</div> : null
    return (
      <GenresProvider value={this.genres}>
        <Online>
          <div className="wrapper">
            <this.RenderSearch />
            {errorIndicator}
            {find}
            <this.RenderMovies />
          </div>
        </Online>
        <Offline>
          <p className="offline-text">We have lost the network, but we have not lost contact...</p>
        </Offline>
      </GenresProvider>
    )
  }
}
