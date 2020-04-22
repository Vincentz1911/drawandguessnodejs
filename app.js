const express = require('express');
const app = express();

//Shows which method and route in console
const logger = require("morgan");
app.use(logger("dev", {skip: req => !req.url.endsWith(".html") && req.url.indexOf(".") > -1}));

//Sets the view engine using ejs and views folder as default
app.set('view engine', 'ejs');
app.set('views', './views');

//Parses responses to readable formats like json
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Connects to database
const mongoose = require('mongoose')
const db = mongoose.connect(
    //"mongodb://localhost:27017/DrawAndGuess?readPreference=primary&appname=MongoDB%20Compass%20Community&ssl=false", {
    "mongodb+srv://Vincentz1911:Pass1234@vincentz1911cluster-qy9xh.mongodb.net/DrawAndGuess?retryWrites=true&w=majority", {
    // useNewUrlParser: true, 
    // useUnifiedTopology: true 
})

//Includes routes and public folder
require('./routes')(app);
app.use(express.static('public'))

//Sets port number to either the development port set in package.json or 3000, and starts the server
const port = process.env.PORT || 8080
app.listen(port, (err) => console.log(`serveren kører på port ${port}`))