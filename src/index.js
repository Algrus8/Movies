import React from "react";
import ReactDOM from "react-dom";
import App from "./Components/App";
import "./style.css";
import "antd/dist/antd.css";
import tmdbService from "./services/tmdbService";
import { Alert } from "antd";

const tmdb = new tmdbService();

async function createSession() {
  const session = await tmdb.guestSession();
  return session.guest_session_id;
}

async function getGenres() {
  const genres = await tmdb.getGenres();
  return genres;
}

async function render() {
  try {
    const sessionId = await createSession();
    const genres = await getGenres();
    ReactDOM.render(
      <App sessionId={sessionId} genres={genres}></App>,
      document.querySelector("#root")
    );
  } catch (error) {
    ReactDOM.render(
      <Alert message={`${error.message}`} type="error" />,
      document.querySelector("#root")
    );
  }
}

render();
