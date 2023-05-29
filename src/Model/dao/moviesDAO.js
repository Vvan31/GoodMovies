const mongodb = require('mongodb')
const { ObjectId } = require('mongodb');
const ReviewsDAO = require('./reviewsDAO.js')
let movies 

class MoviesDAO{ 
    static async injectDB(conn){ 
        if(movies){ 
            return
        }
        try{ 
            movies = await conn.db(process.env.MOVIEREVIEWS_NS)
					.collection('movies')
        } 
        catch(e){
            console.error(`unable to connect in MoviesDAO: ${e}`)
        }
    }

    static async getMovies({// default filter
        filters = null,
        page = 0,
        moviesPerPage = 20, // will only get 20 movies at once
    } = {}){
        let query 
        if(filters){ 
            if("title" in filters){ 
                query = { $text: { $search: filters['title']}}
            }else if("rated" in filters){ 
                query = { "rated": { $eq: filters['rated']}} 
            }                                
        }

        let cursor 
        try{
			cursor = await movies
					.find(query)
					.limit(moviesPerPage)
					.skip(moviesPerPage * page)           
            const moviesList = await cursor.toArray()
            const totalNumMovies = await movies.countDocuments(query)
            return {moviesList, totalNumMovies}
        }
        catch(e){
            console.error(`Unable to issue find command, ${e}`)
            return { moviesList: [], totalNumMovies: 0}
        }
    }
    // This method will be used to get all reviews from a particular movie
/*     static async getMovieById(id){        
        try{                          
            const  reviews = await ReviewsDAO.getMovieReviews(id)                       
            return await movies.aggregate([
                {
                    $match: {
                        _id: new ObjectId(id),
                    }
                },
                reviews
                 { $lookup:
                    {
                        from: 'reviews',
                        localField: '_id',
                        foreignField: 'movie_id',
                        as: 'reviews',
                    }
                }      
            ]).next()            
        }
        catch(e){
            console.error(`something went wrong in getMovieById: ${e}`)
            throw eapiPostReview
        }
    }  */
    static async getMovieById(id) {
        try {
          const movie = await movies.findOne({ _id: new ObjectId(id) });
          
          if (!movie) {
            return null; // Movie not found
          }
    
          const reviews = await ReviewsDAO.getMovieReviews(id);
          movie.reviews = reviews;
    
          return movie;
        } catch (e) {
          console.error(`Something went wrong in getMovieById: ${e}`);
          throw e;
        }
      }

    // This method will be used to get all the distinct ratings.
    static async getRatings(){
        let ratings = []
        try{    
            ratings = await movies.distinct("rated")
            return ratings
        }
        catch(e){
            console.error(`Unable to get ratings, ${e}`)
            return ratings
        }
    }
}

module.exports = MoviesDAO