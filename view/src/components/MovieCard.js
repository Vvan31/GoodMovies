import React, { useState } from "react";
import { Link, Redirect } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Col from 'react-bootstrap/Col';
import "../style/movie-card.css";

const MovieCard = (props) => {
  const { movie } = props;
  const { _id, title, plot, rated, poster } = movie;
  
  const [redirectToMovie, setRedirectToMovie] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const handleClick = () => {
    setRedirectToMovie(true);
  }
  
  const handleSave = () => {
    // Save the movie to favorites
    setIsSaved(true);
  }
  
  if (redirectToMovie) {
    return <Redirect to={`/movies/${_id}`} />;
  }
  
  return (
    <Col key={_id} className="movie-card">
      <Card style={{ width: '18rem' }}>
        {movie.poster ? (
          <Card.Img  onClick={handleClick} className="poster" src={poster + '/100px180'} />
        ) : (
          <Card.Img  onClick={handleClick} className="poster" src={'https://media.giphy.com/media/x5XGS2XRUcYtc9C2fp/giphy.gif'} />
        )}
        {isSaved && (
          <div className="save-button">Saved</div>
        )}
        {!isSaved && (
          <div className="save-button" onClick={handleSave}>Save</div>
        )}
        <Card.Body>
          <Card.Title className="title">{title}</Card.Title>
          <Card.Text className="rating">Rating: {rated}</Card.Text>
          <Card.Text className="plot">{plot}</Card.Text>
          <Link to={`/movies/${_id}`} className="card-link">
            View Reviews
          </Link>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default MovieCard;
