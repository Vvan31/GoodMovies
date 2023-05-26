import React from 'react'
// Components
import AddReview from "./pages/add-review"
import MoviesList from "./pages/movies-list"
import Movie from "./pages/movie"
import Login from "./pages/login" 
// Bootstrap navbar
import Nav from 'react-bootstrap/Nav' 
import Navbar from 'react-bootstrap/Navbar'
// React Router
import { Switch, Route, Link } from "react-router-dom" 
import "bootstrap/dist/css/bootstrap.min.css"

 function App() {
  const [user, setUser] = React.useState(null)
  async function login(user = null) {
    setUser(user)
  }
  async function logout() {
    setUser(null)
  }

  return (
    <div className="App">
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="#home">Good Movies</Navbar.Brand> 
        <Navbar.Toggle aria-controls="basic-navbar-nav" /> 
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
          <Nav.Link>
            <Link to={"/movies"}>Movies</Link>
          </Nav.Link>
          {/* If user */}
          <Nav.Link>
            { user ? (<a onClick={logout}>Logout</a>):(<Link to={"/login"}> Login </Link>)}
          </Nav.Link>
          </Nav> 
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route exact path={["/", "/movies"]} component={MoviesList}> </Route>
        <Route path="/movies/:id/review" render={(props)=>
            <AddReview {...props} user={user} />}>
        </Route>
        <Route path="/movies/:id/" render={(props)=>
            <Movie {...props} user={user} /> }>
        </Route>
        {/* Passing the login function as a prop allows the login function to 
        be called from the Login component and populate the user state variable */}
        <Route path="/login" render={(props)=>
            <Login {...props} login={login} /> }>
        </Route>
    </Switch>
    </div>
    ); 
  }
export default App;
