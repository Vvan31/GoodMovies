/* import React, {useState, useEffect } from 'react'
import MovieDataService from "../service/movies"
import { Link } from "react-router-dom"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';

import '../style/movie-list.css'
// animation 
import { animateScroll } from 'react-scroll';

const MoviesList = props => { 
  
  const [movies, setMovies] = useState([])
  const [searchTitle, setSearchTitle] = useState("")
  const [searchRating, setSearchRating] = useState("")
  const [ratings, setRatings] = useState(["All Ratings"])
  const [currentPage, setCurrentPage] = useState(0)
  const [entriesPerPage, setEntriesPerPage] = useState(0)
  const [currentSearchMode, setCurrentSearchMode] = useState("")  
 // retrieve movies and ratings when component mounts
  useEffect(() =>{ 
    retrieveMovies()
    retrieveRatings()
  },[])
  // reset page number when user changes search mode Its a new seatch. 
  useEffect(() =>{
    setCurrentPage(0)
  },[currentSearchMode])
 // retrieve movies when page number changes
  useEffect(() =>{
    retrieveNextPage()
  },[currentPage])

  const retrieveNextPage = () => {
    if(currentSearchMode === "findByTitle")
      findByTitle()
    else if(currentSearchMode === "findByRating")
      findByRating()      
    else 
      retrieveMovies()
  }

  const scrollToTop = () => {
    animateScroll.scrollToTop({
      duration: 100, // Adjust the duration as desired
      smooth: 'easeOutQuad' // Adjust the smoothness as desired
    });
  };
// retrieve movies when user clicks on next page
  const retrieveMovies = () =>{
    setCurrentSearchMode("")
    MovieDataService.getAll(currentPage)
      .then(response =>{
        console.log(response.data)
        setMovies(response.data.movies) 
        setCurrentPage(response.data.page)
        setEntriesPerPage(response.data.entries_per_page)
        scrollToTop(); // Scroll to top after retrieving movies
      })
      .catch( e =>{
        console.log(e)
      })
    console.log("Movies: " + movies);
      
  }
 // retrieve ratings from backend
  const retrieveRatings = () =>{
    MovieDataService.getRatings()
      .then(response =>{
        console.log(response.data)
 	  //start with 'All ratings' if user doesn't specify any ratings
        setRatings(["All Ratings"].concat(response.data)) 
      })
      .catch( e =>{
        console.log(e)
      })
  }  
  // search by title
  const onChangeSearchTitle = e => {
    const searchTitle = e.target.value
    setSearchTitle(searchTitle);
  }
  // search by rating
  const onChangeSearchRating = e => {
    const searchRating = e.target.value
    setSearchRating(searchRating);
  }  
  // search by title and rating 
  const find =(query, by) =>{
    MovieDataService.find(query,by, currentPage)
      .then(response =>{
        console.log(response.data)
        setMovies(response.data.movies)
      })
      .catch(e =>{
        console.log(e)
      })
  }

  const findByTitle = () => {
    setCurrentSearchMode("findByTitle") 
    find(searchTitle, "title")    
  }
  const findByRating = () => {
    setCurrentSearchMode("findByRating")
    if(searchRating === "All Ratings"){
      retrieveMovies()
    }
    else{
      find(searchRating, "rated")
    }
  }  

  return (
    <div className="App">
      <Container>
        <Form className="form-container">
          <Row>
            <Col>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search by title"
                  value={searchTitle}
                  onChange={onChangeSearchTitle}
                />
              </Form.Group>
              <Button variant="primary" type="button" onClick={findByTitle}>
                Search
              </Button>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control as="select" onChange={onChangeSearchRating}>
                  {ratings.map((rating) => {
                    return (
                      <option value={rating} key={rating}>
                        {rating}
                      </option>
                    );
                  })}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="button" onClick={findByRating}>
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <Row>
          {movies.map((movie) => {
            return (
              <Col key={movie._id} className="movie-card">
                <Card style={{ width: '18rem' }}>
                  <Card.Img src={movie.poster + '/100px180'} />
                  <Card.Body>
                    <Card.Title>{movie.title}</Card.Title>
                    <Card.Text>Rating: {movie.rated}</Card.Text>
                    <Card.Text>{movie.plot}</Card.Text>
                    <Link to={'/movies/' + movie._id} className="card-link">
                      View Reviews
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
        <br />
        <div className="pagination">
          Showing page: {currentPage}.
          <Button variant="link" onClick={() => setCurrentPage(currentPage + 1)}>
            Get next {entriesPerPage} results
          </Button>
        </div>
      </Container>
    </div>
  );
  /* return (
    <div className="App">   
      <Container> <Form>        
        <Row>
          <Col>
              <Form.Group><Form.Control 
                  type="text" 
                  placeholder="Search by title" 
                  value={searchTitle} 
                  onChange={onChangeSearchTitle} 
                /></Form.Group>        
              <Button variant="primary" type="button" onClick={findByTitle}> 
              Search         
              </Button>
            </Col>
            <Col>
              <Form.Group> <Form.Control as="select" onChange={onChangeSearchRating}>
                  {ratings.map(rating =>{
                    return(
                      <option value={rating}>{rating}</option>
                  )})}
                </Form.Control> </Form.Group>    
              <Button variant="primary" type="button" onClick={findByRating}> 
              Search         
              </Button>  
            </Col>
          </Row>              
        </Form> 
        <Row>
            {movies.map((movie) =>{
              return(
                <Col>
                  <Card style={{ width: '18rem' }}>
                    <Card.Img src={movie.poster+"/100px180"} />
                    <Card.Body>
                      <Card.Title>{movie.title}</Card.Title>
                      <Card.Text>
                        Rating: {movie.rated}                        
                      </Card.Text>
                      <Card.Text>{movie.plot}</Card.Text>                                            
                      <Link to={"/movies/"+movie._id} >View Reviews</Link>
                    </Card.Body>
                  </Card>            
                </Col>                
              )
            })}
        </Row>     
        <br />
                Showing page: {currentPage}.
                 <Button
                    variant="link"
                    onClick={() => {setCurrentPage(currentPage + 1)}} 
                >
                    Get next {entriesPerPage} results 
                </Button>     
      </Container>        
    </div>
  ); 

}

export default MoviesList;
 */


import React, { useState, useEffect, useCallback } from 'react';
import MovieDataService from '../service/movies';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import '../style/movie-list.css';
import { animateScroll } from 'react-scroll';

const MoviesList = (props) => {
  const [movies, setMovies] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchRating, setSearchRating] = useState('');
  const [ratings, setRatings] = useState(['All Ratings']);
  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [currentSearchMode, setCurrentSearchMode] = useState('');

  const scrollToTop = useCallback(() => {
    animateScroll.scrollToTop({
      duration: 100,
      smooth: 'easeOutQuad',
    });
  }, []);

  const retrieveMovies = useCallback(async () => {
    setCurrentSearchMode('');
    try {
      const response = await MovieDataService.getAll(currentPage);
      const { movies: fetchedMovies, page, entries_per_page } = response.data;
      setMovies(fetchedMovies);
      setCurrentPage(page);
      setEntriesPerPage(entries_per_page);
      scrollToTop();
    } catch (error) {
      console.log(error);
    }
  }, [currentPage, scrollToTop]);

  const retrieveRatings = useCallback(async () => {
    try {
      const response = await MovieDataService.getRatings();
      const fetchedRatings = response.data;
      setRatings(['All Ratings', ...fetchedRatings]);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await retrieveMovies();
      await retrieveRatings();
    })();
  }, [retrieveMovies, retrieveRatings]);

  const onChangeSearchTitle = (e) => {
    setSearchTitle(e.target.value);
  };

  const onChangeSearchRating = (e) => {
    setSearchRating(e.target.value);
  };

  const find = useCallback(
    async (query, by) => {
      try {
        const response = await MovieDataService.find(query, by, currentPage);
        const { movies: foundMovies } = response.data;
        setMovies(foundMovies);
      } catch (error) {
        console.log(error);
      }
    },
    [currentPage]
  );

  const findByTitle = useCallback(async () => {
    setCurrentSearchMode('findByTitle');
    await find(searchTitle, 'title');
  }, [searchTitle, find]);

  const findByRating = useCallback(async () => {
    setCurrentSearchMode('findByRating');
    if (searchRating === 'All Ratings') {
      await retrieveMovies();
    } else {
      await find(searchRating, 'rated');
    }
  }, [searchRating, find, retrieveMovies]);

  const retrieveNextPage = useCallback(async () => {
    if (currentSearchMode === 'findByTitle') {
      await findByTitle();
    } else if (currentSearchMode === 'findByRating') {
      await findByRating();
    } else {
      await retrieveMovies();
    }
  }, [currentSearchMode, findByTitle, findByRating, retrieveMovies]);

  useEffect(() => {
    retrieveNextPage();
  }, [currentPage, retrieveNextPage]);

  return (
    <div className="App">
      <Container>
        <Form className="form-container">
          <Row>
            <Col>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Search by title"
                  value={searchTitle}
                  onChange={onChangeSearchTitle}
                />
              </Form.Group>
              <Button variant="primary" type="button" onClick={findByTitle}>
                Search
              </Button>
            </Col>
            <Col>
              <Form.Group>
                <Form.Control as="select" onChange={onChangeSearchRating}>
                  {ratings.map((rating) => (
                    <option value={rating} key={rating}>
                      {rating}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Button variant="primary" type="button" onClick={findByRating}>
                Search
              </Button>
            </Col>
          </Row>
        </Form>
        <Row>
          {movies.map((movie) => (
            <Col key={movie._id} className="movie-card">
              <Card style={{ width: '18rem' }}>
                <Card.Img src={movie.poster + '/100px180'} />
                <Card.Body>
                  <Card.Title>{movie.title}</Card.Title>
                  <Card.Text>Rating: {movie.rated}</Card.Text>
                  <Card.Text>{movie.plot}</Card.Text>
                  <Link to={'/movies/' + movie._id} className="card-link">
                    View Reviews
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        <br />
        <div className="pagination">
          Showing page: {currentPage}.
          <Button variant="link" onClick={() => setCurrentPage(currentPage + 1)}>
            Get next {entriesPerPage} results
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default MoviesList;