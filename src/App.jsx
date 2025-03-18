import React, { useEffect, useState } from "react";
import Search from "./components/Search.jsx";
import MovieCard from "./components/MovieCard.jsx";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Corrected: `False` -> `false`

  const fetchMovies = async (query = "") => {
    setIsLoading(true); // Corrected: `value: true` -> `true`
    setErrorMessage("");
    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies. Please try again later");
    } finally {
      setIsLoading(false); // Corrected: `value:false` -> `false`
    }
  };

  useEffect(() => {
    fetchMovies(searchTerm);
  }, [searchTerm]);

  const backgroundStyle = {
    backgroundImage: 'url("/khaver.jpg")',
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "auto", // Ensures the height adjusts based on the image content
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem 0", // Adds padding to ensure space above and below the image
  };

  const imageStyle = {
    maxWidth: "50%",
    height: "auto",
    borderRadius: "8px",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
  };

  const headerStyle = {
    textAlign: "center",
    color: "white",
    marginBottom: "2rem", // Adds space below the header for the movie cards
  };

  const movieSectionStyle = {
    paddingTop: "2rem", // Adds spacing between the header and movie cards
  };

  return (
    <main>
      <div style={backgroundStyle}>
        <div className="wrapper">
          <header style={headerStyle}>
            <img src="./cover.png" alt="Cover Banner" style={imageStyle} />
            <h1>
              Find <span className="text-gradient">Movies</span> You'll Enjoy
              Without the Hassle
            </h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>

          <section className="all-movies" style={movieSectionStyle}>
            <h2>All Movies</h2>
            {isLoading ? (
              <p className="text-white">Loading ...</p>
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map(
                  (
                    movie, // Corrected: `Movie` -> `movie`
                  ) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ),
                )}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;
