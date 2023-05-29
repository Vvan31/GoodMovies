/* import React, { useState } from 'react'
import MovieDataService from "../service/movies"
import { Link } from "react-router-dom"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddReview = props => {
  let editing = false
  let initialReviewState = ""
  const [review, setReview] = useState(initialReviewState)
  const [submitted, setSubmitted] = useState(false)
// check if there is a current review and set editing to true
//check if a state is passed into the AddReview component. 
// In the movie.js file, we passed a state to the Link component to edit
  if(props.location.state && props.location.state.currentReview){
    editing = true
    initialReviewState = props.location.state.currentReview.review
  }

  const onChangeReview = e => {
    const review = e.target.value
    setReview(review);
  } 
 
  const saveReview = () => {
    var data = {
      review: review,
      name: props.user.name,
      user_id: props.user.id,
      movie_id: props.match.params.id // get movie id direct from url
    }
    if(editing){
      data.review_id = props.location.state.currentReview._id
      console.log(data);
      MovieDataService.updateReview(data)
        .then(response => {
          setSubmitted(true)
          console.log(response.data)
        })
        .catch(e => {
          console.log(e)
        })
    }else{
      MovieDataService.createReview(data)
        .then(response => {
        setSubmitted(true)
        })
        .catch(e =>{
          console.log(e);
        })    
      }
  }
  return(
    <div>
      {submitted ? (
        <div>
          <h4>Review submitted successfully</h4>
          <Link to={"/movies/"+props.match.params.id}>
            Back to Movie
          </Link> 
        </div>
      ):(
        <Form>
          <Form.Group>
            <Form.Label>{editing ? "Edit" : "Create"} Review</Form.Label>
            <Form.Control 
              type="text" 
              required
              value={review} 
              onChange={onChangeReview}
            />
          </Form.Group> 
          <Button variant="primary" onClick={saveReview}>
            Submit
          </Button>
        </Form>    
      )}
    </div>
  )
}

export default AddReview; */
import React, { useState } from 'react';
import MovieDataService from '../service/movies';
import { Link } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const AddReview = (props) => {
  const { id } = props.match.params; // get movie id direct from url
  const currentReview = props.location.state?.currentReview; // check if there is a current review and set editing to true 
  const editing = !!currentReview; // check if a state is passed into the AddReview component. In the movie.js file, we passed a state to the Link component to edit
  const initialReviewState = currentReview?.review || ''; // set initial review state to current review if editing
  const [review, setReview] = useState(initialReviewState || "");
  const [submitted, setSubmitted] = useState(false);
  const onChangeReview = (e) => {
    const review = e.target.value;
    setReview(review);
  };

  const saveReview = () => {
    const data = {
      review: review,
      name: props.user.name,
      user_id: props.user.id,
      movie_id: id,
    };

    if (editing) {
      data.review_id = currentReview._id;
      MovieDataService.updateReview(data)
        .then((response) => {
          setSubmitted(true);
          console.log(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    } else {
      MovieDataService.createReview(data)
        .then((response) => {
          setSubmitted(true);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <div>
      {submitted ? (
        <div>
          <h4>Review submitted successfully</h4>
          <Link to={`/movies/${id}`}>Back to Movie</Link>
        </div>
      ) : (
        <Form>
          <Form.Group>
            <Form.Label>{editing ? 'Edit' : 'Create'} Review</Form.Label>
            <Form.Control
              type="text"
              required
              value={review}
              onChange={onChangeReview}
            />
          </Form.Group>
          <Button variant="primary" onClick={saveReview}>
            Submit
          </Button>
        </Form>
      )}
    </div>
  );
};

export default AddReview;
