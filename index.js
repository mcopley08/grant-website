var express = require('express');
var request = require('request'); // "Request" library
var querystring = require('querystring');
var bodyParser = require('body-parser');
var app = express();
var http = require('http').createServer(app);
var http_obj = require('http');

var Logger = require('le_node');

// this was for chef-ware
// var log = new Logger({
//   token:'0193579f-077a-32d5-8b82-f668588330d8'
// });

// parse application/json
app.use(bodyParser.urlencoded({
  extended: true
}));

require('./models/Grants');

mongoose = require('mongoose'),
fs = require('fs');
Grants = mongoose.model('Grants');

// connecting to the mongodb database
var mongoUri = 'mongodb://lacopley:pokemom@ds057944.mongolab.com:57944/macomb-county-grants';
var options = { server: { socketOptions: { connectTimeoutMS: 25000 }}}; // bc our database has a shitty response time.

mongoose.connect(mongoUri, options, function(err) {
	if (err) {
  	  throw new Error('unable to connect to database at ' + mongoUri);
	}
	else {
		console.log('successfully connected to the mongodb database in the cloud');
	}
});
var db = mongoose.connection;
db.on('error', function () {
  throw new Error('unable to connect to database at ' + mongoUri);
});

// ************* defining routes that AREN'T part fo the API ****************
var router = express.Router();

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

app.set('port', (process.env.PORT || 8080));
app.use(express.static(__dirname + '/public'));

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

// ACTUAL ROUTES

app.get('/', function(req, res) {
  // query mongodb for the upcoming deadlines for grants
  // query mongodb for the latest articles
  res.render('index', {});
});

app.get('/search', function(req, res) {

  // query mongodb, check in javascript or search for substring in the grant's title
  res.render('search', {ra: req.query.keywords} );
});

app.get('/update', function(req, res) {

  var query = { "name": "Trade Adjustment Assistance for Firms Program" };

  var update = {
    "name": "Trade Adjustment Assistance for Firms Program",
    "link": "http://www.grants.gov/web/grants/view-opportunity.html?oppId=279141",
    "deadline": new Date(2015, 11, 24),
    "category": "economic-community-development",
    "eligibility": "cities, county, nonprofit, colleges",
    "award": 1500000,
    "description": "cost shared technical assistance to strengthen the competitiveness of American companies negatively impacted by increasing imports"
  };

  Grants.findOneAndUpdate(query, update, { upsert: true }, function(err, doc){
    if (err) return res.send(500, { error: err });
    console.log("succesfully added grant to the mongodb database");
    var message = "succesfully added grant to the mongodb database";
    console.log(update);
    res.render('update', {message: message, update: update});
  });

});

app.get('/:category', function(req, res) {
  // draw some mongodb information
  res.render('category', {category: req.params.category});
});



// ************************ Listening on Port 8080 ******************
// app.listen(process.env.PORT || 8080);
// console.log('listening on port 8080... hahaha...');

http.listen(process.env.PORT || 8080, function(){
  console.log('Listening on port 8080...');
});

