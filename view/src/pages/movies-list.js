
import React, { useState, useEffect, useCallback } from 'react';
import MovieDataService from '../service/movies';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner'; // Import the Spinner component

import '../style/movie-list.css';
import { animateScroll } from 'react-scroll';

//Components
import MovieCard from '../components/MovieCard';

const MoviesList = (props) => {
  const [movies, setMovies] = useState([]);
  const [searchTitle, setSearchTitle] = useState('');
  const [searchRating, setSearchRating] = useState('');
  const [ratings, setRatings] = useState(['All Ratings']);
  const [currentPage, setCurrentPage] = useState(0);
  const [entriesPerPage, setEntriesPerPage] = useState(0);
  const [currentSearchMode, setCurrentSearchMode] = useState('');
  const [loading, setLoading] = useState(false); 
  const scrollToTop = useCallback(() => {
    animateScroll.scrollToTop({
      duration: 100,
      smooth: 'easeOutQuad',
    });
  }, []);
 // This function will be called when the user clicks on the "Next" page button
 // It will retrieve the next page of movies from the API
  const retrieveMovies = useCallback(async () => {
    setCurrentSearchMode('');
    try {
      setLoading(true);
      const response = await MovieDataService.getAll(currentPage);
      const { movies: fetchedMovies, page, entries_per_page } = response.data;
      setMovies(fetchedMovies);
      setCurrentPage(page);
      setEntriesPerPage(entries_per_page);
      setLoading(false);
      console.log(loading);
      scrollToTop();
    } catch (error) {
      console.log(error);
      setLoading(false); 
    }
  }, [currentPage, scrollToTop]);
 // This function will be called once to retrieve all the ratings from the API
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
 // This function will be called when the user clicks on the "Search" button
  const findByTitle = useCallback(async () => {
    setCurrentSearchMode('findByTitle');
    await find(searchTitle, 'title');
  }, [searchTitle, find]);
  // This function will be called when the user clicks on the "Apply Filter" button
  const findByRating = useCallback(async () => {
    setCurrentSearchMode('findByRating');
    if (searchRating === 'All Ratings') {
      await retrieveMovies();
    } else {
      await find(searchRating, 'rated');
    }
  }, [searchRating, find, retrieveMovies]);
 // This function will be called when the user clicks on the "Next" page button
 // It will retrieve the next page of movies from the API depending on the current search mode
  const retrieveNextPage = useCallback(async () => {
    if (currentSearchMode === 'findByTitle') {
      await findByTitle();
    } else if (currentSearchMode === 'findByRating') {
      await findByRating();
    } else {
      await retrieveMovies();
    }
  }, [currentSearchMode, findByTitle, findByRating, retrieveMovies]);

 // This useEffect will be called every time the currentPage changes
 // It will retrieve the next page of movies from the API
  useEffect(() => {
    retrieveNextPage();
  }, [currentPage, retrieveNextPage]);

  return (
    <div className="App">
      <Container>
      <Form className="form-container">
          <Row>
            <Col xs={12} sm={6} className="d-flex mb-2">
              <Form.Group className="flex-grow-1 mr-2">
                <Form.Control
                  type="text"
                  placeholder="Search by title"
                  value={searchTitle}
                  onChange={onChangeSearchTitle}
                  className='search-input'
                />
              </Form.Group>
              <Button variant="primary" type="button" onClick={findByTitle}>
                Search
              </Button>
            </Col>
            <Col xs={7} sm={5} className="d-flex mb-2">
              <Form.Group className="flex-grow-1 mr-2">
                <Form.Select as="select" onChange={onChangeSearchRating} className='search-input'>
                  {ratings.map((rating) => (
                    <option value={rating} key={rating}>
                      {rating}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button variant="primary" type="button" onClick={findByRating} className="btn">
                Apply Filter
              </Button>
            </Col>
          </Row>
        </Form>
        <Row>
          {loading ? (
            <div className="spinner-container">
              <Spinner animation="border" variant="primary" />
            </div>
          ):(
            movies.map((movie) => (
              <MovieCard movie={movie} key={movie.id} />
            ))
          )}
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