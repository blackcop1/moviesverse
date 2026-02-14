class MovieManager {
    constructor() {
        this.movies = this.loadFromLocalStorage() || [];
        this.loadFromJSON();
    }

    loadFromJSON() {
        fetch('data/movies.json')
            .then(response => response.json())
            .then(data => {
                this.movies = data.movies || [];
                this.syncWithLocalStorage();
            })
            .catch(error => console.error('Error loading movies:', error));
    }

    syncWithLocalStorage() {
        localStorage.setItem('movies', JSON.stringify(this.movies));
    }

    loadFromLocalStorage() {
        const movies = localStorage.getItem('movies');
        return movies ? JSON.parse(movies) : [];
    }

    addMovie(movie) {
        this.movies.push(movie);
        this.syncWithLocalStorage();
    }

    updateMovie(updatedMovie) {
        const index = this.movies.findIndex(movie => movie.id === updatedMovie.id);
        if (index !== -1) {
            this.movies[index] = updatedMovie;
            this.syncWithLocalStorage();
        }
    }

    deleteMovie(movieId) {
        this.movies = this.movies.filter(movie => movie.id !== movieId);
        this.syncWithLocalStorage();
    }

    filterMovies(criteria) {
        return this.movies.filter(movie => movie.title.includes(criteria) || movie.genre.includes(criteria));
    }

    exportToJSON() {
        return JSON.stringify({ movies: this.movies }, null, 2);
    }

    importFromJSON(jsonString) {
        const data = JSON.parse(jsonString);
        this.movies = data.movies || [];
        this.syncWithLocalStorage();
    }
}

// Example usage
const movieManager = new MovieManager();
// movieManager.addMovie({ id: 1, title: "Inception", genre: "Sci-Fi" });
// console.log(movieManager.filterMovies("Inception"));
