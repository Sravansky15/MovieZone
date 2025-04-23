const OMDB_API_KEY = "3bdd1c59"; // Replace with your OMDB API Key
const TMDB_API_KEY = "db545383a3a70177774650ca04437a3a"; // Replace with your TMDb API Key
const OMDB_URL = "https://www.omdbapi.com/";
const TMDB_URL = "https://api.themoviedb.org/3/";

function searchMovie() {
    let movieName = document.getElementById("search-box").value;

    if (movieName === "") {
        alert("Please enter a movie name!");
        return;
    }

    fetch(`${OMDB_URL}?apikey=${OMDB_API_KEY}&t=${movieName}`)
        .then(response => response.json())
        .then(data => {
            if (data.Response === "False") {
                document.getElementById("movie-details").innerHTML = `<p>Movie not found!</p>`;
                return;
            }

            document.getElementById("movie-details").innerHTML = `
                <h2>${data.Title} (${data.Year})</h2>
                <img src="${data.Poster}" alt="${data.Title} Poster">
                <p><strong>IMDB Rating:</strong> ${data.imdbRating}</p>
                <p><strong>Plot:</strong> ${data.Plot}</p>
                <p><strong>Genre:</strong> ${data.Genre}</p>
                <p><strong>Director:</strong> ${data.Director}</p>
            `;

            fetchRecommendations(data.Genre.split(",")[0]); // Get recommendations based on first genre
        })
        .catch(error => console.log(error));
}

function fetchRecommendations(genre) {
    document.getElementById("recommendations").innerHTML = "<p>Loading recommendations...</p>";

    // Fetch Hindi movies
    fetch(`${TMDB_URL}discover/movie?api_key=${TMDB_API_KEY}&with_genres=${getGenreID(genre)}&sort_by=popularity.desc&with_original_language=hi&vote_count.gte=100`)
        .then(response => response.json())
        .then(hindiData => {
            // Fetch English movies
            fetch(`${TMDB_URL}discover/movie?api_key=${TMDB_API_KEY}&with_genres=${getGenreID(genre)}&sort_by=popularity.desc&with_original_language=en&vote_count.gte=100`)
                .then(response => response.json())
                .then(englishData => {
                    // Combine Hindi and English movies
                    let allMovies = [
                        ...hindiData.results,
                        ...englishData.results
                    ];

                    // Limit to top 6 movies from combined list
                    let movies = allMovies.slice(0, 6);

                    let recommendationsHTML = movies.map(movie => `
                        <div class="recommendation">
                            <img src="https://image.tmdb.org/t/p/w200${movie.poster_path}" alt="${movie.title}">
                            <p>${movie.title} (${movie.release_date.split("-")[0]})</p>
                        </div>
                    `).join("");

                    document.getElementById("recommendations").innerHTML = recommendationsHTML;
                })
                .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
}

// Convert genre name to TMDb genre ID
function getGenreID(genre) {
    const genreMap = {
        "Action": 28,
        "Adventure": 12,
        "Animation": 16,
        "Comedy": 35,
        "Crime": 80,
        "Documentary": 99,
        "Drama": 18,
        "Family": 10751,
        "Fantasy": 14,
        "History": 36,
        "Horror": 27,
        "Music": 10402,
        "Mystery": 9648,
        "Romance": 10749,
        "Science Fiction": 878,
        "TV Movie": 10770,
        "Thriller": 53,
        "War": 10752,
        "Western": 37
    };

    return genreMap[genre] || 18; // Default to "Drama" if genre not found
}
