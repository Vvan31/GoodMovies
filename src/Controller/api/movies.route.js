
const express = require('express') // import express
const MoviesController = require('../../Controller/api/movies.controller.js') // import MoviesController
const ReviewsController = require('../../Controller/api/reviews.controller.js') // import MoviesController

const router = express.Router() // get access to express router

/* router.route('/').get((req,res) => res.send('hello world'))  */
/* router.route('/').get((req,res) => res.send(MoviesController.apiGetMovies())) */
router.route('/').get((req, res) => {
  MoviesController.apiGetMovies(req, res); // Invoke the apiGetMovies function
});
//This route retrieves a specific movie and all reviews associated with that movie
router.route("/id/:id").get(MoviesController.apiGetMovieById) 
// This route returns a list of movie ratings (such as G, PG, R) so that a user 
// can select the ratings from a dropdown menu in the frontend.
router.route("/ratings").get(MoviesController.apiGetRatings)

router.route("/review") 
  .post(ReviewsController.apiPostReview) 
  .put(ReviewsController.apiUpdateReview) 
  .delete(ReviewsController.apiDeleteReview)   
module.exports = router // export router
