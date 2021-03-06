export default class tmdbService {
  constructor() {
    this.apiKey = '364353da666b2d8315c57bbe6c83c550'
  }

  async searchMovies(query, page) {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=${this.apiKey}&query=${query}&page=${page}`
    )

    if (!res.ok) {
      throw new Error("Сan't find movies") // eslint-disable-line
    }

    return await res.json()
  }

  async guestSession() {
    const session = await fetch(`https://api.themoviedb.org/3/authentication/guest_session/new?api_key=${this.apiKey}`)
    if (!session.ok) {
      throw new Error("Сan't create guest session") // eslint-disable-line
    }

    return await session.json()
  }

  async ratedMovies(sessionId, page) {
    const rated = await fetch(
      `https://api.themoviedb.org/3/guest_session/${sessionId}/rated/movies?api_key=${this.apiKey}&page=${page}`
    )

    if (!rated.ok) {
      throw new Error("Сan't find rated movies") // eslint-disable-line
    }

    return await rated.json()
  }

  async rateMovie(movieId, session, rate) {
    const requestBody = {
      value: rate,
    }
    const post = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/rating?api_key=${this.apiKey}&guest_session_id=${session}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify(requestBody),
      }
    )

    if (!post.ok) {
      throw new Error("Сan't rate movie") // eslint-disable-line
    }

    return post
  }

  async getGenres() {
    const genres = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${this.apiKey}`)
    const json = await genres.json()
    return json.genres
  }
}
