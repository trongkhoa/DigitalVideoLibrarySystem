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






app.listen(4000);
