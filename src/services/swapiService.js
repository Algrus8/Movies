// const myKey =
//   "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzNjQzNTNkYTY2NmIyZDgzMTVjNTdiYmU2YzgzYzU1MCIsInN1YiI6IjYyNTdlNjIzYTBiNjkwMTJjMmRjZGRmMyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.i79EOOPDVAipjgL4hxJo_eG9B8OjpaqdiLHwKbwYoHs";

// const myKeyV3 = "364353da666b2d8315c57bbe6c83c550";

// .then((res) => res.json())
// .then((res) => {
//   console.log(res);
// });

export default class swapiService {
  async searchMovies() {
    const res = await fetch(
      "https://api.themoviedb.org/3/search/movie?api_key=364353da666b2d8315c57bbe6c83c550&query=return"
    );
    return await res.json();
  }
}
