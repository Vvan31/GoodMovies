const express = require('express')
const cors = require('cors')
const movies = require('../Controller/api/movies.route.js')

const app = express()
app.use(cors()) 
app.use(express.json())

app.use("/api/movies", movies) 
app.use('*', (req,res)=>{
  res.status(404).json({error: "not found"}) 
})

module.exports = app
/* export default app */