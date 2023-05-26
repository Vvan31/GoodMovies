import axios from "axios";

export class MovieDataService{
    
   getAll(page = 0){ 
     return axios.get(`http://localhost:5000/api/movies?page=${page}`)
   }

   get(id){ 
     return axios.get(`http://localhost:5000/api/movies/id/${id}`)
   }   

   find(query, by = "title", page = 0){
     return axios.get(`http://localhost:5000/api/movies?${by}=${query}&page=${page}`)
   }       

   createReview(data){
     return axios.post("http://localhost:5000/api/movies/review", data)
   }
   updateReview(data){
     return axios.put("http://localhost:5000/api/movies/review", data)
   }
   deleteReview(id, userId){
     return axios.delete("http://localhost:5000/api/movies/review",
        {data:{review_id: id, user_id: userId}}
     )
   }
   getRatings(){
     return axios.get("http://localhost:5000/api/movies/ratings")
   }    
}
const movieDataService = new MovieDataService()
export default movieDataService;