import React, {useState, useEffect} from 'react'
import MovieDataService from '../service/movies'
import { Link } from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
//import Media from 'react-bootstrap/Media';
import moment from 'moment';

import '../style/movie.css';
const Movie = props => {
  
  const [movie, setMovie] = useState({
    id: null,
    title: "",
    rated:"",
    reviews:[]
  })

  const getMovie = id =>{
    MovieDataService.get(id)
      .then(response => {
        setMovie(response.data)
        console.log(response.data)
      })
      .catch(e =>{
        console.log(e)
      })
  }

  const deleteReview = (reviewId, index) => {
    MovieDataService.deleteReview(reviewId, props.user.id)
      .then(response => {
        setMovie((prevState) => { // use prevState to update state
          prevState.reviews.splice(index, 1) // remove review from array
          return({
            ...prevState // return updated state
          })
        })
      })
      .catch(e => {
        console.log(e)
      })
  }
  
  useEffect(()=>{ 
    getMovie(props.match.params.id)
  },[props.match.params.id]) 


  return (
    <div className='App'>
      <Container className='container'>
        <Row>
          <Col xs={12} md={6}>
             {movie.poster ? (
        <Image src={movie.poster + "/100px250"} fluid className='image' />
          ) : (
        <Image fluid className='image' src={'https://media.giphy.com/media/x5XGS2XRUcYtc9C2fp/giphy.gif'} /> // Replace `genericPictureUrl` with the URL of your generic picture
        )}

          </Col>
          <Col xs={12} md={6}>
            <Card className='plot'>
              <Card.Header as="h5">{movie.title}</Card.Header>
              <Card.Body>
                <Card.Text>{movie.plot}</Card.Text>
                {props.user && (
                  <Link to={"/movies/" + props.match.params.id + "/review"} className='btn'>
                    Add Review
                  </Link>
                )}
              </Card.Body>
            </Card>
            <br />
            <h2>Reviews</h2>
            <br />
            {movie.reviews.map((review, index) => {
              return (
                <Card key={index} className='review'>
                  <Card.Body>
                    <h5>
                      {review.name + " reviewed on "} {moment(review.date).format("Do MMMM YYYY")}
                    </h5>
                    <p>{review.review}</p>
                    {props.user && props.user.id === review.user_id && (
                      <Row>
                        <Col>
                          <Link
                            to={{
                              pathname: "/movies/" + props.match.params.id + "/review",
                              state: { currentReview: review }
                            }}
                            className='btn'
                          >
                            Edit
                          </Link>
                        </Col>
                        <Col>
                          <Button variant="link" onClick={() => deleteReview(review._id, index)}>
                            Delete
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </Card.Body>
                </Card>
              );
            })}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Movie;