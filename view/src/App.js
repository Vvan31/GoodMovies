import React from 'react'
import { Switch, Route, Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"

import AddReview from "./pages/add-review"
import MoviesList from "./pages/movies-list"
import Movie from "./pages/movie"
import Login from "./pages/login" 

import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'

import './App.css'
function App() {
  const [user, setUser] = React.useState(null)

  async function login(user = null){// default user to null
    setUser(user)
  }

  async function logout(){
    setUser(null)
  }

  return (
    <div className="App">
       <Navbar bg="light" expand="lg" className="Navbar">
        <Navbar.Brand className="brand">Movie Reviews</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link className="link">
              <Link to={'/movies'} className="nav-link">
                Movies
              </Link>
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link className="login">
              {user ? (
                <button onClick={logout} className="btn btn-link nav-link">
                  Logout User
                </button>
              ) : (
                <Link to={'/login'} className="nav-link">
                  Login
                </Link>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route exact path={['/', '/movies']} component={MoviesList}></Route>
        <Route
          path="/movies/:id/review"
          render={(props) => <AddReview {...props} user={user} />}
        ></Route>
        <Route
          path="/movies/:id/"
          render={(props) => <Movie {...props} user={user} />}
        ></Route>
        <Route
          path="/login"
          render={(props) => <Login {...props} login={login} />}
        ></Route>
      </Switch>
    </div>
  );
}

export default App;
