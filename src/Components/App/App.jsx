import React, { Component } from "react";
import MovieList from "../MovieList";
import Search from "../Search";
import "./app.css";
import { Pagination, Alert } from "antd";
import swapiService from "../../services/swapiService";
export default class App extends Component {
  state = {
    query: "",
    movies: [],
    loading: true,
    error: false,
    notFind: false,
    totalPages: null,
    currentPage: 1,
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { query, currentPage } = this.state;
    if (query !== prevState.query || currentPage !== prevState.currentPage) {
      this.searchMovies();
    }
  };

  onSearchChange = (query) => {
    this.setState({ query: query });
  };

  onError() {
    this.setState({ error: true, loading: false });
  }

  onPaginationChange = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  };

  debounce = (fn, debounceTime) => {
    let timeOut;
    return function (...args) {
      const functionCall = () => fn.apply(this, args);
      clearTimeout(timeOut);
      timeOut = setTimeout(functionCall, debounceTime);
    };
  };

  searchMovies = () => {
    const { query, currentPage } = this.state;
    if (query) {
      const swapi = new swapiService();
      this.setState({ loading: true });
      swapi
        .searchMovies(query, currentPage)
        .then((response) => {
          console.log(response);
          if (response.results.length === 0) {
            this.setState({ notFind: true });
          } else {
            this.setState({
              movies: response.results.slice(0, 6),
              loading: false,
              notFind: false,
              totalPages: response.total_pages,
            });
          }
        })
        .catch(() => {
          this.onError();
        });
    }
  };

  renderMovies = () => {
    const { movies, loading, error, query, notFind, totalPages } = this.state;

    return !notFind && query && !error ? (
      <React.Fragment>
        <MovieList movies={movies} loading={loading}></MovieList>
        <Pagination
          defaultCurrent={1}
          onChange={this.onPaginationChange}
          pageSize="6"
          total={totalPages}
          showSizeChanger={false}
        ></Pagination>
      </React.Fragment>
    ) : null;
  };

  render() {
    const debounceSearch = this.debounce(this.onSearchChange, 500);
    const { error, query, notFind } = this.state;

    const errorMessage = error ? <Alert message="Error" type="error" /> : null;
    const find =
      notFind && query ? (
        <div className="nothing-found">Nothing found</div>
      ) : null;

    return (
      <div className="wrapper">
        <Search onSearchChange={debounceSearch} query={query}></Search>
        {errorMessage}
        {find}
        {this.renderMovies()}
      </div>
    );
  }
}
