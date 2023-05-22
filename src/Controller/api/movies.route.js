
const express = require('express') // import express
const MoviesController = require('../../Controller/api/movies.controller.js') // import MoviesController
const ReviewsController = require('../../Controller/api/reviews.controller.js') // import MoviesController

const router = express.Router() // get access to express router

/* router.route('/').get((req,res) => res.send('hello world'))  */
router.route('/').get((req,res) => res.send(MoviesController.apiGetMovies))
router.route("/review") 
  .post(ReviewsController.apiPostReview) 
  .put(ReviewsController.apiUpdateReview) 
  .delete(ReviewsController.apiDeleteReview)   

module.exports = router // export router