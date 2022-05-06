import React, { Component } from 'react'
import './search.css'
export default class Search extends Component {
  render() {
    const { onSearchChange, showAllOrRated, onlyRated, query } = this.props
    const searchClass = onlyRated ? 'search-button' : 'search-button active'
    const ratedClass = onlyRated ? 'rated-button active' : 'rated-button'

    const searchBar = onlyRated ? null : (
      <input
        value={query}
        type="text"
        className="search-movies"
        placeholder="Type to search..."
        onChange={(event) => {
          onSearchChange(event.target.value)
        }}
      />
    )

    return (
      <div className="search">
        <div className="search-buttons">
          <button className={searchClass} onClick={showAllOrRated}>
            Search
          </button>
          <button className={ratedClass} onClick={showAllOrRated}>
            Rated
          </button>
        </div>
        {searchBar}
      </div>
    )
  }
}
