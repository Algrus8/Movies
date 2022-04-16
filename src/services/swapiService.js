export default class swapiService {
  async searchMovies() {
    const res = await fetch(
      "https://api.themoviedb.org/3/search/movie?api_key=364353da666b2d8315c57bbe6c83c550&query=return"
    );
    return await res.json();
  }
}
