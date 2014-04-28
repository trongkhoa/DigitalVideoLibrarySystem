/**
 * New node file
 */

var application_root = __dirname,
express = require("express"),
path = require("path"),
ejs = require("ejs");
var app = express();
var request = require("request");
var mysql = require("./mysql_connect");

var title = 'EJS template with Node.JS';
var data = 'Data from node';
var mysql_connection = require('mysql');

//----MYSQL Connection----//
var connection = mysql_connection.createConnection({
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

//-----------Search for All Movies------//
app.post('/DisplayAllMovies', function(req,res){
	//Checking the MYSQL connection is available
	if (connection){
		//Catching parameters and check if they are available or not
		var movieName = req.param("movieName");
		
		var movieBanner = req.param("movieBanner");
		
		var releaseDate = req.param("rdate");
		
		var category = req.param("category");
		
		var availableCopies = req.param("availableCopies");
		
		var rentAmount = req.param("rent");
		
		//create the query for each one
		var query = "select * from movies";
//		if (movieName || query || movieBanner || releaseDate || category ){
//			
//			query = query + " where ";
//		}
		if (movieName){
			console.log("User want to see the Movie Name:" + movieName);
			movieName = movieName + "%";
			console.log(movieName);
			//query to match the string input using LIKE in mySQL
			query = query + " where name like " + connection.escape(movieName);
			//if you get error, copy the line on the console log and check in your SQL terminal
			console.log("SQL search for Movie Name:" + query);
		} else if(movieBanner){
			movieBanner = movieBanner + "%";
			console.log(movieBanner);
			query = "select * from movies where bannerName like " + connection.escape(movieBanner);
			console.log("SQL search for Movie Banner:" + query);
			
		} else if(releaseDate){
			releaseDate = releaseDate + "%";
			console.log(releaseDate);
			query = "select * from movies where releaseDate like " + connection.escape(releaseDate);
			console.log("SQL search for release Date:" + query);
			
		}else if(category){
			category = category + "%";
			console.log(category);
			query = "select * from movies where category like " + connection.escape(category);
			console.log("SQL search for category:" + query);
			
		}else if(availableCopies){
			availableCopies = availableCopies + "%";
			console.log(availableCopies);
			query = "select * from movies where availableCopies like " + connection.escape(availableCopies);
			console.log("SQL search for available copies:" + query);
			
		}else if(rentAmount){
			rentAmount = rentAmount + "%";
			console.log(rentAmount);
			query = "select * from movies where rentAmount like " + connection.escape(rentAmount);
			console.log("SQL search for rent Amount:" + query);
		}
		
//		//Display all movies
//		else{
//			
//			query = "select * from movies";
//		}
		
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



//-----------Search for All Members------//
app.post('/DisplayAllMembers', function(req,res){
	//Checking the MYSQL connection is available
	if (connection){
		//Catching parameters and check if they are available or not
		var firstName = req.param("firstName");
		
		var lastName = req.param("lastName");
		
		var membershipNo = req.param("memNum")
		
		var address = req.param("address");
		
		var city = req.param("city");
		
		var state = req.param("state");
		
		var zipcode = req.param("zipcode");
		
		//create the query for each one
		var query;
		if (firstName){
			console.log("User want to see the Movie Name:" + firstName);
			firstName = firstName + "%";
			console.log(firstName);
			//query to match the string input using LIKE in mySQL
			query = "select * from customers where fname like " + connection.escape(firstName);
			//if you get error, copy the line on the console log and check in your SQL terminal
			console.log("SQL search for First Name:" + query);
		} else if(lastName){
			lastName = lastName + "%";
			console.log(lastName);
			query = "select * from customers where lname like " + connection.escape(lastName);
			console.log("SQL search for lastName:" + query);
			
		}else if(membershipNo){
			membershipNo = membershipNo + "%";
			console.log(membershipNo);
			query = "select * from customers where membershipno like " + connection.escape(membershipNo);
			console.log("SQL search for membershipNo:" + query);
			
		}else if(address){
			address = address + "%";
			console.log(address);
			query = "select * from customers where address like " + connection.escape(address);
			console.log("SQL search for address:" + query);
			
		}else if(city){
			city = city + "%";
			console.log(city);
			query = "select * from customers where city like " + connection.escape(city);
			console.log("SQL search for city:" + query);
			
		}else if(state){
			state = state + "%";
			console.log(state);
			query = "select * from customers where state like " + connection.escape(state);
			console.log("SQL search for state:" + query);
			
		}else if(zipcode){
			zipcode = zipcode + "%";
			console.log(zipcode);
			query = "select * from customers where zipcode like " + connection.escape(zipcode);
			console.log("SQL search for zipcode:" + query);
		}
		
		//Display all movies
		else{
			
			query = "select * from customers";
		}
		
		//Query and render the output of the DB to JSON objects
		connection.query(query, function(err, members){
			console.log(members);
			if (!err){
			ejs.renderFile('./views/memberList.ejs',
			        {"members":members}, //<--- JSON passed to EJS
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
