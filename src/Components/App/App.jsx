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
  }

  componentDidUpdate = (prevProps, prevState) => {
    const { query, currentPage, currentRatedPage } = this.state
    if (query !== prevState.query || currentPage !== prevState.currentPage) {
      this.searchMovies()
    }
    if (prevState.currentRatedPage !== currentRatedPage) {
      this.searchRatedMovies()
    }
  }

  componentDidCatch() {
    this.setState({ error: true })
  }

  onSearchChange = (query) => {
    this.setState({ query: query })
  }

  onError = () => {
    this.setState({ error: true, loading: false })
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
        .catch(() => {
          this.onError()
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
      .catch(() => {
        this.onError()
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
        ></MovieList>
        <Pagination
          current={onlyRated ? currentRatedPage : currentPage}
          onChange={this.onPaginationChange}
          pageSize="1"
          total={onlyRated ? totalRatedPages : totalPages}
          showSizeChanger={false}
        ></Pagination>
      </React.Fragment>
    )
  }

  RenderSearch = () => {
    const debounceSearch = this.debounce(this.onSearchChange, 500)
    const { onlyRated, error } = this.state
    if (error) {
      return null
    }
    return <Search onSearchChange={debounceSearch} showAllOrRated={this.showAllOrRated} onlyRated={onlyRated} />
  }

  render() {
    const { error, query, notFind } = this.state
    const errorMessage = error ? <Alert message="Error" type="error" /> : null

    const find = notFind && query ? <div className="nothing-found">Nothing found</div> : null
    return (
      <GenresProvider value={this.genres}>
        <div className="wrapper">
          <Online>
            <this.RenderSearch />
            {errorMessage}
            {find}
            <this.RenderMovies />
          </Online>
          <Offline>
            <p className="offline-text">We have lost the network, but we have not lost contact...</p>
          </Offline>
        </div>
      </GenresProvider>
    )
  }
}
