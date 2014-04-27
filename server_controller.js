/**
 * New node file
 */
//async = require("async")
var application_root = __dirname,
express = require("express"),
path = require("path"),
ejs = require("ejs");
var app = express();
var request = require("request");
var mysql = require("./mysql_connect");
//var mysql = require("./connectionPooling");
var usercache = {};
var cachesize = 100;

var title = 'EJS template with Node.JS';
var data = 'Data from node';
var mysql = require('mysql');

//----MYSQL Connection----//
var connection = mysql.createConnection({
	host     : 'localhost',
	user     : 'root',
	password : '',
	port: '3306',
	database: 'VideoLibraryManagement'
});
connection.connect();


app.use(express.cookieParser());
app.use(express.session({secret: '1234567890QWERTY'}));

app.configure(function () {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
	
	app.get('/loginPage', function (req, res) {

		ejs.renderFile('./views/loginPage.ejs',
				{title : title, data : data},
				function(err, result) {
					// render on success
					if (!err) {
						res.end(result);
					}
					// render or error
					else {	
						res.end('An error occurred');
						console.log(err);
					}
				});
	});
	

	app.post('/validate', function (req, res) {
		console.log('in /Home page after clicking Sign in from login');
		mysql.validateUser(function(err,userResults){
			if(err){
				console.log("error wrong password");
				ejs.renderFile('InvalidUser.ejs',
						{title : title, data : data},
						function(err, result) {
							// render on success
							if (!err) {
								res.end(result);
							}
							// render or error
							else {
								res.end('An error occurred');
								console.log(err);
							}
						});
			}
			else{
				//console.log(userResults[0].timeStamp);
				//req.session.userName = userResults[0].uname;
				res.redirect('/home');
			}
		},req.param('userName'),req.param('Password'));
	});

});

app.get('/home', function(req,res){

	ejs.renderFile('./views/homePage.ejs',
			        {title : title, data : data},
					function(err, result) {
						// render on success
						if (!err) {
							res.end(result);
						}
						// render or error
						else {
							res.end('An error occurred');
							console.log(err);
						}
					});
	
});

app.post('/addCustomer', function(req,res){

	ejs.renderFile('./views/addCustomer.ejs',
			        {title : title, data : data},
					function(err, result) {
						// render on success
						if (!err) {
							res.end(result);
						}
						// render or error
						else {
							res.end('An error occurred');
							console.log(err);
						}
					});
	
});

app.post('/addMovie', function(req,res){

	ejs.renderFile('./views/addMovie.ejs',
			        {title : title, data : data},
					function(err, result) {
						// render on success
						if (!err) {
							res.end(result);
						}
						// render or error
						else {
							res.end('An error occurred');
							console.log(err);
						}
					});
	
});

app.post('/searchCustomer', function(req,res){

	ejs.renderFile('./views/searchCustomer.ejs',
			        {title : title, data : data},
					function(err, result) {
						// render on success
						if (!err) {
							res.end(result);
						}
						// render or error
						else {
							res.end('An error occurred');
							console.log(err);
						}
					});
	
});


app.post('/searchMovie', function(req,res){

	ejs.renderFile('./views/searchMovie.ejs',
			        {title : title, data : data},
					function(err, result) {
						// render on success
						if (!err) {
							res.end(result);
						}
						// render or error
						else {
							res.end('An error occurred');
							console.log(err);
						}
					});
	
});

//-----------DisplayAllMovies------//
app.post('/DisplayAllMovies', function(req,res){
	//Checking the MYSQL connection is available
	if (connection){
		//Catching parameters and check if they are available or not
		var movieName = req.param("movieName");
		//and others
		
		//create the query for each one
		var query;
		if (movieName){
			console.log("User want to see the Movie Name:" + movieName);
			movieName = movieName + "%";
			console.log(movieName);
			//query to match the string input using LIKE in mySQL
			query = "select * from movies where name like " + connection.escape(movieName);
			//if you get error, copy the line on the console log and check in your SQL terminal
			console.log("SQL search for Movie Name:" + query);
		}else{
			
			query = "select * from movies";
		}
		
		
		
		//Query and render the output of the DB to JSON objects
		connection.query(query, function(err, movies){
			console.log(movies);
			if (!err){
			ejs.renderFile('./views/movieList.ejs',
			        {"movies":movies}, //<--- JSON passed to EJS
					function(err, result) {
						// render on success
						if (!err) {
							res.end(result);
						}
						// render or error
						else {
							res.end('An error occurred');
							console.log(err);
						}
					});
			
			}
			else{
				console.log("Something wrong with DB MYSQL");
				
			}
		});
		
		
	}
	
	
	
});





app.listen(4000);
