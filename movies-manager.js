'use strict';

class MovieManager {
    constructor() {
        this.movies = this.loadMovies();
    }

    // Load movies from localStorage or JSON
    loadMovies() {
        const storedMovies = localStorage.getItem('movies');
        return storedMovies ? JSON.parse(storedMovies) : [];
    }

    // Save movies to localStorage
    saveMovies() {
        localStorage.setItem('movies', JSON.stringify(this.movies));
    }

    // Add a movie
    addMovie(movie) {
        this.movies.push(movie);
        this.saveMovies();
    }

    // Edit an existing movie
    editMovie(index, updatedMovie) {
        this.movies[index] = updatedMovie;
        this.saveMovies();
    }

    // Delete a movie
    deleteMovie(index) {
        this.movies.splice(index, 1);
        this.saveMovies();
    }

    // Filter movies by a given criterion
    filterMovies(criteria) {
        return this.movies.filter(movie => movie.title.includes(criteria));
    }

    // Export movies to JSON
    exportMovies() {
        return JSON.stringify(this.movies, null, 2);
    }

    // Import movies from JSON
    importMovies(json) {
        this.movies = JSON.parse(json);
        this.saveMovies();
    }
}

// Example usage:
const manager = new MovieManager();

// Adding a movie
manager.addMovie({ title: 'Inception', year: 2010 });

// Exporting movies
console.log(manager.exportMovies());
