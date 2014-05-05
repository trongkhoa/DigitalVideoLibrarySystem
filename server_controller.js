/**
 * New node file
 */

var application_root = __dirname, express = require("express"), path = require("path"), ejs = require("ejs");
var app = express();
var request = require("request");
var mysql = require("./mysql_connect");

var title = 'EJS template with Node.JS';
var data = 'Data from node';
var mysql_connection = require('mysql');

// ----MYSQL Connection----//
var connection = mysql_connection.createConnection({
	host : 'localhost',
	user : 'root',
	password : '',
	port : '3306',
	database : 'VideoLibraryManagement'
});
connection.connect();

app.use(express.cookieParser());
app.use(express.session({
	secret : '1234567890QWERTY'
}));

app.configure(function() {
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(application_root, "public")));
	app.use(express.errorHandler({
		dumpExceptions : true,
		showStack : true
	}));

	app.get('/loginPage', function(req, res) {

		ejs.renderFile('./views/loginPage.ejs', {
			title : title,
			data : data
		}, function(err, result) {
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
	
	app.post('/register', function(req, res) {

		ejs.renderFile('./views/register.ejs', {
			title : title,
			data : data
		}, function(err, result) {
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
	
	//--Validate new user--//
	
	app.post('/uservalidate', function (req, res) {
		if (connection){
			//Catching parameters and check if they are available or not
			var memberNo = req.param("memNum");

			var password = req.param("Password");
			
			var insertQuery = "INSERT INTO users VALUES('"+memberNo+"','"+password+"', \"user\")";
			console.log(insertQuery);
//			var query = "SELECT * FROM users WHERE username ='"+memberNo+"' and password = '"+password+"'";
//			console.log(query);
			connection.query(insertQuery, function(err, members){
				console.log(members);
				if(err){
					console.log("error wrong password");
					res.send("Error can't register the user");
				}
				else{
					res.redirect('/loginPage');
				}

			});

		}
	});
	
	// -- User Home page --//
	app.get('/userhome', function(req,res){
		var membershipno = req.param('membershipno');
		
		ejs.renderFile('./views/userhomepage.ejs',
				{data : membershipno},
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

	app.post('/validate', function(req, res) {
		console.log('in /Home page after clicking Sign in from login');
		mysql.validateUser(function(err, userResults) {
			if (err) {
				console.log("error wrong password");
				ejs.renderFile('InvalidUser.ejs', {
					title : title,
					data : data
				}, function(err, result) {
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
			} else {
				if(userResults[0].roles =="admin"){
					res.redirect('/home');
				}else if (userResults[0].roles =="user"){
					ejs.renderFile('./views/userhomepage.ejs', {
						title : title,
						data : userResults[0]
					}, function(err, result) {
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
			}
		}, req.param('userName'), req.param('Password'));
	});

});

//-- View user profile -- //
app.get('/viewProfile', function(req,res){
	
	if(connection){

	var memberNum = req.param('membershipno');

	var query = "SELECT * FROM customers WHERE membershipno = " + connection.escape(memberNum);

	console.log(memberNum);
	connection.query(query, function(err, members){
		console.log(members);
		if (!err){
			ejs.renderFile('./views/userProfile.ejs',
					{"members":members[0]}, //<--- JSON passed to EJS
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

//-- View user profile -- //
app.get('/viewHistory', function(req,res){
	
	if(connection){

	var memberNum = req.param('membershipno');

	
	var query = "SELECT m.name, m.category, mr.issuedDate, mr.returnDate, m.rentAmount FROM moviesreturn mr INNER JOIN movies m on mr.movieId = m.id INNER JOIN customers s on mr.membershipNo = s.membershipno where mr.membershipNo = "
		+ connection.escape(memberNum);
	
	//var query = "SELECT * FROM customers WHERE membershipno = " + connection.escape(memberNum);

	console.log(memberNum);
	connection.query(query, function(err, movies){
		console.log(movies);
		if (!err){
			ejs.renderFile('./views/userHistory.ejs',
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




app.get('/home', function(req, res) {

	ejs.renderFile('./views/homePage.ejs', {
		title : title,
		data : data
	}, function(err, result) {
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

app.get('/addCustomer', function(req, res) {

	ejs.renderFile('./views/addCustomer.ejs', {
		title : title,
		data : data
	}, function(err, result) {
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

app.get('/addMovie', function(req, res) {

	ejs.renderFile('./views/addMovie.ejs', {
		title : title,
		data : data
	}, function(err, result) {
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

app.get('/searchCustomer', function(req, res) {

	ejs.renderFile('./views/searchCustomer.ejs', {
		title : title,
		data : data
	}, function(err, result) {
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

app
		.post(
				'/addNewMember',
				function(req, res) {
					if (connection) {
						// Catching parameters and check if they are available
						// or not
						var memType = req.param("member");

						var firstName = req.param("firstName");

						var lastName = req.param("lastName");

						var membershipNo = req.param("memNum")

						var address = req.param("address");

						var city = req.param("city");

						var state = req.param("state");

						var zipCode = req.param("zipCode");
						var amount =0;
						if (memType){
							amount =20;
						}	
						// create the query for each one
						var query = 'INSERT INTO `videolibrarymanagement`.`customers` (`id`, `membershipno`, `fname`, `lname`, `address`, `city`, `state`, `zipcode`, `membertype`, `amount`, `status`) VALUES (NULL, '
								+ connection.escape(membershipNo)
								+ ','
								+ connection.escape(firstName)
								+ ','
								+ connection.escape(lastName)
								+ ','
								+ connection.escape(address)
								+ ','
								+ connection.escape(city)
								+ ','
								+ connection.escape(state)
								+ ','
								+ connection.escape(zipCode)
								+ ','
								+ connection.escape(memType)
								+ ','
								+ connection.escape(amount)
								+ ', \"active\")';

						console.log("Add a new member " + " " + memType + " "
								+ firstName + " " + lastName + " "
								+ membershipNo + " " + address + " " + city
								+ " " + state + " " + zipCode);
						console.log("Query : " + query);
						connection
								.query(
										query,
										function(err, members) {
											if (err) {
												console
														.log("Can't add new member to DB");
												return res
														.send('Failed to created a new member');
											} else {
												console.log(members);
												return res
														.send('Successfully created a new member');
											}

										});
					}
					return;

				});

app
		.post(
				'/addNewMovie',
				function(req, res) {
					if (connection) {
						// Catching parameters and check if they are available
						// or not
						var movieName = req.param("movieName");

						var movieBanner = req.param("movieBanner");

						var releaseDate = req.param("rdate");

						var category = req.param("category");

						var availableCopies = req.param("quantity");

						var rentAmount = req.param("rentAmount");

						// create the query for each one
						var query = 'INSERT INTO `videolibrarymanagement`.`movies` (`id`, `name`, `bannerName`, `releaseDate`, `category`, `rentAmount`, `availableCopies`, `status`) VALUES (NULL, '
								+ connection.escape(movieName)
								+ ','
								+ connection.escape(movieBanner)
								+ ','
								+ connection.escape(releaseDate)
								+ ','
								+ connection.escape(category)
								+ ','
								+ connection.escape(rentAmount)
								+ ','
								+ connection.escape(availableCopies) + ',"available" )';

						console.log("Add a new movie " + " " + movieName + " "
								+ movieBanner + " " + releaseDate + " "
								+ category + " " + rentAmount + " "
								+ availableCopies);
						console.log("Query : " + query);
						connection
								.query(
										query,
										function(err, movies) {
											if (err) {
												console
														.log("Can't add new movie to DB");
												return res
														.send('Failed to create a new movie');
											} else {
												console.log(movies);
												return res
														.send('Successfully add a new movie');
											}

										});
					}
					return;

				});

app.get('/searchMovie', function(req, res) {

	ejs.renderFile('./views/searchMovie.ejs', {
		title : title,
		data : data
	}, function(err, result) {
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


app.get('/customersearchMovie', function(req, res) {

	ejs.renderFile('./views/customersearchMovie.ejs', {
		title : title,
		data : data
	}, function(err, result) {
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




// -----------Update a Member-----------//
app
		.post(
				'/updateMember',
				function(req, res) {
					if (connection) {
						// Catching parameters and check if they are available
						// or not
						var memType = req.param("member");

						var firstName = req.param("firstName");

						var lastName = req.param("lastName");

						var membershipNo = req.param("memNum")

						var address = req.param("address");

						var city = req.param("city");

						var state = req.param("state");

						var zipCode = req.param("zipCode");

						var status = req.param("status");

						var amount = req.param("amount");
						var oldMembershipNo = req.param("oldMembershipNo");

						// create the query for each one
						var query = 'UPDATE `videolibrarymanagement`.`customers` SET `membershipno` ='
								+ connection.escape(membershipNo)
								+ ',`fname` = '
								+ connection.escape(firstName)
								+ ',`lname` = '
								+ connection.escape(lastName)
								+ ',`address` = '
								+ connection.escape(address)
								+ ',	`city` ='
								+ connection.escape(city)
								+ ',`state` = '
								+ connection.escape(state)
								+ ',`zipcode` = '
								+ connection.escape(zipCode)
								+ ',`membertype` = '
								+ connection.escape(memType)
								+ ',`status` = '
								+ connection.escape(status)
								+ ',`amount` = '
								+ connection.escape(amount)
								+ 'WHERE `customers`.`membershipno` ='
								+ connection.escape(oldMembershipNo);

						console.log("Add a new member " + " " + memType + " "
								+ firstName + " " + lastName + " "
								+ membershipNo + " " + address + " " + city
								+ " " + state + " " + zipCode + " " + status);
						console.log("Query : " + query);
						connection.query(query, function(err, members) {
							if (err) {
								console.log("Can't edit the member in DB");
								return res.send('Failed to edit the member');
							} else {
								console.log(members);
								return res.send("Successfully edited");
							}

						});
					}

				});
// -----------Edit a Member-----------//
app.post('/editMember', function(req, res) {
	var userInfo = req.param("member");
	console.log("Edit member: " + userInfo);
	if (connection) {
		// Catching parameters and check if they are available
		// or not

		// create the query for each one
		var query = "Select * From customers Where membershipno ="
				+ connection.escape(userInfo);

		console.log("Edit a member " + "Query : " + query);
		connection.query(query, function(err, members) {
			if (err) {
				console.log("Can't add new member to DB");
				return res.send('Failed to created a new member');
			} else {
				console.log(members);
				ejs.renderFile('./views/editMember.ejs', {
					member : members[0]
				}, function(err, result) {
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

		});
	}

	// res.send("Successfully edit the member" + userInfo);

});
// -----------Delete a Member-----------//
app
		.post(
				'/deleteMember',
				function(req, res) {
					var memberNo = req.param("member");
					console.log("Edit member: " + memberNo);
					var query = 'UPDATE  `videolibrarymanagement`.`customers` SET  `status` =  \'inactive\' WHERE  `customers`.`membershipno` = '
							+ connection.escape(memberNo);
					connection.query(query, function(err, result) {
						if (!err) {
							console.log("users is inactive now: " + result);
						} else {
							console.log("error can't edit user's status: "
									+ err);
						}

					});
					res.send("Successfully deleted the member" + memberNo);

				});

// -----------Helper function-----------//
function movieTransaction(membershipno, itemid, available) {

	// --------//Substract 1 from movies//----------//
	var qSubMovies = "UPDATE `movies` SET `availableCopies` = `availableCopies` - 1, `status` = "
			+ connection.escape(available) + " WHERE `id` = " + itemid;

	connection.query(qSubMovies, function(err1, result1) {
		if (err1) {
			console.log("Error can't subtract 1 from movies" + err1);
			connection.rollback(function() {
				throw err;
			});
		} else {
			console.log("Succesfully substract 1 from movies" + result1);
		}
	});

	// --------//Add 1 to Cart//----------//
	var qCart = "INSERT INTO `videolibrarymanagement`.`cart` (`transactionId`, `membershipNo`, `movieId`, `issuedDate`, `status`) "
			+ "VALUES (NULL, "
			+ membershipno
			+ ", "
			+ itemid
			+ ", "
			+ "NOW()"
			+ ", " + "'pending')";
	console.log(qCart);

	connection.query(qCart, function(err2, result2) {
		if (err2) {
			console.log("Error can't insert into cart" + err2);
			connection.rollback(function() {
				throw err;
			});
		} else {
			console.log('add To Cart successfully!');
			// res.send("Add movie to cart successfully");
		}

	});
	// ------------------//

}
function movieReturnTransaction(itemReturn) {
	console.log("Return: " + itemReturn.movieId);
	var issueDate = new Date(itemReturn.issuedDate)
	console.log("Issue date: " + issueDate.toISOString());
	var formattedIssuedDate = issueDate.getUTCFullYear() + "-"
			+ issueDate.getUTCMonth() + "-" + issueDate.getUTCDate() + " "
			+ issueDate.getUTCHours() + ":" + issueDate.getUTCMinutes() + ":"
			+ issueDate.getUTCSeconds();
	console.log("Format date" + formattedIssuedDate);
	// --------//Substract 1 from movies//----------//
	var qSubMovies = "UPDATE `movies` SET `availableCopies` = `availableCopies` + 1, `status` = 'available'"
			+ " WHERE `id` = " + itemReturn.movieId;

	connection.query(qSubMovies, function(err, result) {
		if (err) {
			console.log("Error can't add 1 from movies" + err);
			connection.rollback(function() {
				throw err;
			});
		} else {
			console.log("Succesfully add 1 from movies" + result);
		}
	});
	var qCart = "UPDATE `cart` SET `status` = 'returned' "
			+ " WHERE `transactionId` = " + itemReturn.transactionId;
	console.log(qCart);
	connection.query(qCart, function(err1, result1) {
		if (err1) {
			console.log("Error can't change status on cart" + err1);
			connection.rollback(function() {
				throw err1;
			});
		} else {
			console.log("Succesfully changed status on cart" + result1);
		}
	});
	// --------//ReturnedMovie//----------//
	var qReturnMovies = "INSERT INTO `videolibrarymanagement`.`moviesReturn` (`id`, `membershipno`, `movieid`, `issuedDate`, `returnDate`) "
			+ "VALUES (NULL, "
			+ connection.escape(itemReturn.membershipno)
			+ ", "
			+ itemReturn.movieId
			+ ", "
			+ connection.escape(formattedIssuedDate) + ", " + "NOW())";
	console.log(qReturnMovies);

	connection.query(qReturnMovies, function(err2, result2) {
		if (err2) {
			// res.send("Error can't return movie" + err2);
			console.log("Error can't return movie" + err2);
			connection.rollback(function() {
				throw err2;
			});
		} else {
			console.log('Successfully return movie');
			// res.send("Add movie to cart successfully");
		}

	});
	// ------------------//

}
// -----------Add Movie To Cart-----------//
app.post('/addMovieToCart', function(req, res) {
	var membershipno = req.param("membershipno");
	var itemid = req.param("itemid");
	console.log("membershipno: " + membershipno);
	console.log("itemid: " + itemid);
	// itemid = connection.escape(itemid);
	membershipno = connection.escape(membershipno);
	var query = "Select availableCopies FROM movies Where id= " + itemid;
	connection.query(query, function(err, result) {
		if (err) {
			res.send("Error can't insert into cart" + err);
		} else {
			var quantity = result[0].availableCopies;
			console.log("Current quantity: " + quantity);
			if (quantity > 1) {
				// ---Transaction------//
				connection.beginTransaction(function(err) {

					if (err) {
						throw err;
					}
					movieTransaction(membershipno, itemid, "available");
					// --------Commit----------//
					connection.commit(function(err) {
						if (err) {
							connection.rollback(function() {
								throw err;
							});
						}
						res.send("Add movie to cart successfully");
						console.log('Transaction add To Cart successfully!');
					});

					// --------End Commit----------//
					// ---End Transaction------//
				});
			} else if (quantity == 1) {
				// ---Transaction------//
				connection.beginTransaction(function(err) {

					if (err) {
						throw err;
					}
					movieTransaction(membershipno, itemid, "unavailable");

					// --------Commit----------//
					connection.commit(function(err) {
						if (err) {
							connection.rollback(function() {
								throw err;
							});
						}
						res.send("Add movie to cart successfully");
						console.log('Transaction add To Cart successfully!');
					});

					// --------End Commit----------//
					// ---End Transaction------//
				});

			} else {
				res.send("Run out of stock.");
			}// End if Quantity
		}// End if on Select quantity
	});// Query Quantity
});

// -----------Issue a Movie-----------//
app
		.post(
				'/issueMovie',
				function(req, res) {
					var userInfo = req.param("member");
					console.log("Edit member: " + userInfo);
					// res.send("Successfully edit the member" + userInfo);
					var query = 'Select status, membertype From customers Where membershipno='
							+ connection.escape(userInfo);
					console.log(query);
					// SELECT count(*) as numberItem, status
					// FROM `videolibrarymanagement`.`cart`
					// WHERE `membershipno` = '789-12-4568' and `status` =
					// 'pending'
					// Group By `status`

					connection
							.query(
									query,
									function(err, result) {
										var queryItemHold = "SELECT count(*) as numberItem, status FROM  `videolibrarymanagement`.`cart` WHERE  `membershipno` = "
												+ connection.escape(userInfo)
												+ " and `status` = 'pending' Group By `status`";
										console.log(queryItemHold);
										console.log("Member Status and type: "
												+ JSON.stringify(result[0]));
										connection
												.query(
														queryItemHold,
														function(err,
																resultQuery) {
															console
																	.log("Membertype:"
																			+ result[0].membertype);
															console
																	.log("Count movies checked out:"
																			+ JSON
																					.stringify(resultQuery));
															if (resultQuery.length) {
																if (result[0].membertype == 1
																		&& resultQuery[0].numberItem >= 10) {
																	console
																			.log("Premium member can't check out more than 10 movies");
																	res
																			.send("Premium member can't check out more than 10 movies"
																					+ "<a href=\"/home\"> Back </a>");
																	return;
																} else if (result[0].membertype == 0
																		&& resultQuery[0].numberItem >= 2) {
																	console
																			.log("Premium member can't check out more than 10 movies");
																	res
																			.send("Standar member can't check out more than 2 movies"
																					+ "<a href=\"/home\"> Back </a>")
																	return;
																}
															}

															if (!err) {
																var userStatus = result[0].status;
																console
																		.log("users status "
																				+ userStatus);
																if (userStatus === "inactive") {
																	res
																			.send("Can't issue movies to inactive users");
																} else {
																	// res.render('issuedMovies.ejs');
																	ejs
																			.renderFile(
																					'./views/issuedMovies.ejs',
																					{
																						"member" : userInfo
																					},
																					function(
																							err,
																							result) {
																						// render
																						// on
																						// success
																						if (!err) {
																							res
																									.end(result);
																						}
																						// render
																						// or
																						// error
																						else {
																							res
																									.end('An error occurred');
																							console
																									.log(err);
																						}
																					});
																}

															} else {
																console
																		.log("error can't edit user's status: "
																				+ err);
															}

														});

									});

				});
// -----------Return a Movie-----------//
app
		.post(
				'/returnMovie',
				function(req, res) {
					var memberInfo = req.param("member");
					if (connection) {
						var query = "SELECT s.fname , s.lname , m.name, c.issuedDate, c.transactionId, c.status, c.movieId, s.membershipno, m.rentAmount, s.amount FROM cart c INNER JOIN movies m on c.movieId = m.id INNER JOIN customers s on c.membershipNo = s.membershipno where c.membershipNo = "
								+ connection.escape(memberInfo);

						console.log("Edit a movie " + "Query : " + query);
						connection.query(query, function(err, movies) {
							if (err) {
								console.log("Can't return movies to DB");
								return res.send('Failed to return movies');
							} else {
								console.log(movies);
								ejs.renderFile('./views/returnMovie.ejs', {
									"movies" : movies
								}, function(err, result) {
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
								console.log("Edit member: " + memberInfo);

							}
						});
					}
				});

// -----------ReturnIssuedMovie--------//
app
		.post(
				'/returnIssuedMovies',
				[ express.urlencoded(), express.json() ],
				function(req, res) {
					console.log("post data " + JSON.stringify(req.body));
					var itemReturn = req.body;
					console.log("post data " + itemReturn.membershipno);
					var query = "Select status From Cart Where `transactionId` = "
							+ connection.escape(itemReturn.transactionId);
					connection
							.query(
									query,
									function(error, result) {
										if (error) {
											throw error;
										} else {
											var status = result[0].status;
											console.log("item status: "
													+ status);
											if (status === "pending") {
												// ---Transaction------//
												connection
														.beginTransaction(function(
																err) {

															if (err) {
																throw err;
															}
															movieReturnTransaction(itemReturn);
															// --------Commit----------//
															connection
																	.commit(function(
																			err) {
																		if (err) {
																			connection
																					.rollback(function() {
																						throw err;
																					});
																		}
																		res
																				.send("Add movie to cart successfully");
																		console
																				.log('Transaction add To Cart successfully!');
																	});

															// --------End
															// Commit----------//

															// ---End
															// Transaction------//
															// res.send("Successfully
															// return movie!");

														});

											} else {
												res
														.send("Can't return a returned movie");
											}
										}

									});

				});

// -----------Edit a Movie-----------//
app.post('/editMovie', function(req, res) {
	var movieInfo = req.param("movieId");
	console.log("Edit movie: " + movieInfo);
	if (connection) {
		// Catching parameters and check if they are available
		// or not

		// create the query for each one
		var query = "Select * From movies Where id ="
				+ connection.escape(movieInfo);

		console.log("Edit a movie " + "Query : " + query);
		connection.query(query, function(err, movies) {
			if (err) {
				console.log("Can't add new movie to DB");
				return res.send('Failed to created a new movie');
			} else {
				console.log(movies);
				ejs.renderFile('./views/editMovie.ejs', {
					movie : movies[0]
				}, function(err, result) {
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

		});
	}

	// res.send("Successfully edit the member" + userInfo);

});

// -----------Update a Movie-----------//
app.post('/updateMovie', function(req, res) {
	if (connection) {
		// Catching parameters and check if they are available
		// or not
		var id = req.param("movieId");
		var moviename = req.param("movieName");

		var bannername = req.param("bannerName");

		var releaseDate = req.param("reldate")

		var category = req.param("category");

		var rent = req.param("rent");

		var copies = req.param("copies");

		var status = req.param("status");

		// create the query for each one
		var query = 'UPDATE `videolibrarymanagement`.`movies` SET `name` ='
				+ connection.escape(moviename) + ',`bannerName` = '
				+ connection.escape(bannername) + ',`releaseDate` = '
				+ connection.escape(releaseDate) + ',`category` = '
				+ connection.escape(category) + ',	`rentAmount` ='
				+ connection.escape(rent) + ',`availableCopies` = '
				+ connection.escape(copies) + ',`status` = '
				+ connection.escape(status) + ' WHERE `movies`.`id` ='
				+ connection.escape(id);
		console.log("Edit movie " + " " + moviename + " " + bannername + " "
				+ releaseDate + " " + category + " " + rent + " " + copies
				+ " " + status);
		console.log("Query : " + query);
		connection.query(query, function(err, movies) {
			if (err) {
				console.log("Can't edit the movie in DB");
				return res.send('Failed to edit the movie');
			} else {
				console.log(movies);
				return res.send("Successfully edited");
			}

		});
	}

});

// -----------Delete a Movie-----------//
app
		.post(
				'/deleteMovie',
				function(req, res) {
					var movieInfo = req.param("movieId");
					console.log("Edit movie: " + movieInfo);
					var query = 'UPDATE  `videolibrarymanagement`.`movies` SET  `status` =  \'unavailable\' WHERE  `movies`.`id` = '
							+ connection.escape(movieInfo);
					connection.query(query, function(err, result) {
						if (!err) {
							console.log("movie is unavailable now: " + result);
						} else {
							console.log("error can't edit user's status: "
									+ err);
						}

					});
					res.send("Successfully deleted the movie id" + movieInfo);

				});

// -----------Search for All Movies in JSON------//
app.post('/DisplayAllMoviesJSON', function(req, res) {
	// Checking the MYSQL connection is available
	if (connection) {
		// Catching parameters and check if they are available or not
		var movieName = req.param("movieName");

		var movieBanner = req.param("movieBanner");

		var releaseDate = req.param("rdate");

		var category = req.param("category");

		// create the query for each one
		var query = "select * from movies";
		// if (movieName || query || movieBanner || releaseDate || category ){
		//			
		// query = query + " where ";
		// }
		if (movieName) {
			console.log("User want to see the Movie Name:" + movieName);
			movieName = movieName + "%";
			console.log(movieName);
			// query to match the string input using LIKE in mySQL
			query = query + " where name like " + connection.escape(movieName);
			// if you get error, copy the line on the console log and check in
			// your SQL terminal
			console.log("SQL search for Movie Name:" + query);
		} else if (movieBanner) {
			movieBanner = movieBanner + "%";
			console.log(movieBanner);
			query = "select * from movies where bannerName like "
					+ connection.escape(movieBanner);
			console.log("SQL search for Movie Banner:" + query);

		} else if (releaseDate) {
			releaseDate = releaseDate + "%";
			console.log(releaseDate);
			query = "select * from movies where releaseDate like "
					+ connection.escape(releaseDate);
			console.log("SQL search for release Date:" + query);

		} else if (category) {
			category = category + "%";
			console.log(category);
			query = "select * from movies where category like "
					+ connection.escape(category);
			console.log("SQL search for category:" + query);

		}

		// Query and render the output of the DB to JSON objects
		connection.query(query, function(err, movies) {
			console.log(movies);
			if (!err) {
				res.send(movies);

			} else {
				console.log("Something wrong with DB MYSQL");

			}
		});

	}

});

// -----------Search for All Movies------//
app.post('/DisplayAllMovies', function(req, res) {
	// Checking the MYSQL connection is available
	if (connection) {
		// Catching parameters and check if they are available or not
		var movieName = req.param("movieName");

		var movieBanner = req.param("movieBanner");

		var releaseDate = req.param("rdate");

		var category = req.param("category");

		var availableCopies = req.param("availableCopies");

		var rentAmount = req.param("rent");

		// create the query for each one
		var query = "select * from movies";
		// if (movieName || query || movieBanner || releaseDate || category ){
		//			
		// query = query + " where ";
		// }
		if (movieName) {
			console.log("User want to see the Movie Name:" + movieName);
			movieName = movieName + "%";
			console.log(movieName);
			// query to match the string input using LIKE in mySQL
			query = query + " where name like " + connection.escape(movieName);
			// if you get error, copy the line on the console log and check in
			// your SQL terminal
			console.log("SQL search for Movie Name:" + query);
		} else if (movieBanner) {
			movieBanner = movieBanner + "%";
			console.log(movieBanner);
			query = "select * from movies where bannerName like "
					+ connection.escape(movieBanner);
			console.log("SQL search for Movie Banner:" + query);

		} else if (releaseDate) {
			releaseDate = releaseDate + "%";
			console.log(releaseDate);
			query = "select * from movies where releaseDate like "
					+ connection.escape(releaseDate);
			console.log("SQL search for release Date:" + query);

		} else if (category) {
			category = category + "%";
			console.log(category);
			query = "select * from movies where category like "
					+ connection.escape(category);
			console.log("SQL search for category:" + query);

		} else if (availableCopies) {
			availableCopies = availableCopies + "%";
			console.log(availableCopies);
			query = "select * from movies where availableCopies like "
					+ connection.escape(availableCopies);
			console.log("SQL search for available copies:" + query);

		} else if (rentAmount) {
			rentAmount = rentAmount + "%";
			console.log(rentAmount);
			query = "select * from movies where rentAmount like "
					+ connection.escape(rentAmount);
			console.log("SQL search for rent Amount:" + query);
		}

		// Query and render the output of the DB to JSON objects
		connection.query(query, function(err, movies) {
			console.log(movies);
			if (!err) {
				ejs.renderFile('./views/movieList.ejs', {
					"movies" : movies
				}, // <--- JSON passed to EJS
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

			} else {
				console.log("Something wrong with DB MYSQL");

			}
		});

	}

});

//-----------Search for All Movies------//
app.post('/customerdisplayMovies', function(req, res) {
	// Checking the MYSQL connection is available
	if (connection) {
		// Catching parameters and check if they are available or not
		var movieName = req.param("movieName");

		var movieBanner = req.param("movieBanner");

		var releaseDate = req.param("rdate");

		var category = req.param("category");

		var availableCopies = req.param("availableCopies");

		var rentAmount = req.param("rent");

		// create the query for each one
		var query = "select * from movies";

		if (movieName) {
			console.log("User want to see the Movie Name:" + movieName);
			movieName = movieName + "%";
			console.log(movieName);
			// query to match the string input using LIKE in mySQL
			query = query + " where name like " + connection.escape(movieName);
			// if you get error, copy the line on the console log and check in
			// your SQL terminal
			console.log("SQL search for Movie Name:" + query);
		} else if (movieBanner) {
			movieBanner = movieBanner + "%";
			console.log(movieBanner);
			query = "select * from movies where bannerName like "
					+ connection.escape(movieBanner);
			console.log("SQL search for Movie Banner:" + query);

		} else if (releaseDate) {
			releaseDate = releaseDate + "%";
			console.log(releaseDate);
			query = "select * from movies where releaseDate like "
					+ connection.escape(releaseDate);
			console.log("SQL search for release Date:" + query);

		} else if (category) {
			category = category + "%";
			console.log(category);
			query = "select * from movies where category like "
					+ connection.escape(category);
			console.log("SQL search for category:" + query);

		} else if (availableCopies) {
			availableCopies = availableCopies + "%";
			console.log(availableCopies);
			query = "select * from movies where availableCopies like "
					+ connection.escape(availableCopies);
			console.log("SQL search for available copies:" + query);

		} else if (rentAmount) {
			rentAmount = rentAmount + "%";
			console.log(rentAmount);
			query = "select * from movies where rentAmount like "
					+ connection.escape(rentAmount);
			console.log("SQL search for rent Amount:" + query);
		}

		// Query and render the output of the DB to JSON objects
		connection.query(query, function(err, movies) {
			console.log(movies);
			if (!err) {
				ejs.renderFile('./views/customermovieList.ejs', {
					"movies" : movies
				}, // <--- JSON passed to EJS
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

			} else {
				console.log("Something wrong with DB MYSQL");

			}
		});

	}

});






// -----------Search for All Members JSON------//
app.get('/DisplayAllMembersJSON', function(req, res) {
	// Checking the MYSQL connection is available
	if (connection) {

		// Display all movies
		var query = "select * from customers";

		// Query and render the output of the DB to JSON objects
		connection.query(query, function(err, members) {
			// console.log(members);
			if (!err) {
				// <--- JSON passed to EJS
				console.log("DisplayAllMembersJSON : " + members);
				res.send(members);

			} else {

				console.log("Something wrong with DB MYSQL");

			}
		});

	}

});

// For Display members on all pages //
app.get('/displayMembers', function(req, res) {
	if (connection) {
		var query = "select * from customers";
		connection.query(query, function(err, members) {
			console.log(members);
			if (!err) {
				ejs.renderFile('./views/memberList.ejs', {
					"members" : members
				}, // <--- JSON passed to EJS
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

			} else {
				console.log("Something wrong with DB MYSQL");

			}
		});
	}
});

// ---- For Display movies on all pages---- //
app.get('/displayMovies', function(req, res) {
	if (connection) {
		var query = "select * from movies";
		connection.query(query, function(err, movies) {
			console.log(query);
			if (!err) {
				ejs.renderFile('./views/movieList.ejs', {
					"movies" : movies
				}, // <--- JSON passed to EJS
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

			} else {
				console.log("Something wrong with DB MYSQL");

			}
		});
	}
});

// -----------Search for All Members------//
app.post('/DisplayAllMembers', function(req, res) {
	// Checking the MYSQL connection is available
	if (connection) {
		// Catching parameters and check if they are available or not
		var memType = req.param("member");
		var firstName = req.param("firstName");

		var lastName = req.param("lastName");

		var membershipNo = req.param("memNum")

		var address = req.param("address");

		var city = req.param("city");

		var state = req.param("state");

		var zipcode = req.param("zipCode");

		// create the query for each one
		// Display all movies
		var query = "select * from customers";
		if (memType) {
			console.log("User want to see the Movie Name:" + memType);
			if (memType !== "-1") {
				query = "select * from customers where memberType like "
						+ connection.escape(memType);

				memType = memType + "%";
				console.log(memType);
				// query to match the string input using LIKE in mySQL
				// if you get error, copy the line on the console log and check
				// in your SQL terminal
				console.log("SQL search for First Name:" + query);
			}
		} else if (firstName) {
			console.log("User want to see the Movie Name:" + firstName);
			firstName = firstName + "%";
			console.log(firstName);
			// query to match the string input using LIKE in mySQL
			query = "select * from customers where fname like "
					+ connection.escape(firstName);
			// if you get error, copy the line on the console log and check in
			// your SQL terminal
			console.log("SQL search for First Name:" + query);
		} else if (lastName) {
			lastName = lastName + "%";
			console.log(lastName);
			query = "select * from customers where lname like "
					+ connection.escape(lastName);
			console.log("SQL search for lastName:" + query);

		} else if (membershipNo) {
			membershipNo = membershipNo + "%";
			console.log(membershipNo);
			query = "select * from customers where membershipno like "
					+ connection.escape(membershipNo);
			console.log("SQL search for membershipNo:" + query);

		} else if (address) {
			address = address + "%";
			console.log(address);
			query = "select * from customers where address like "
					+ connection.escape(address);
			console.log("SQL search for address:" + query);

		} else if (city) {
			city = city + "%";
			console.log(city);
			query = "select * from customers where city like "
					+ connection.escape(city);
			console.log("SQL search for city:" + query);

		} else if (state) {
			state = state + "%";
			console.log(state);
			query = "select * from customers where state like "
					+ connection.escape(state);
			console.log("SQL search for state:" + query);

		} else if (zipcode) {
			zipcode = zipcode + "%";
			console.log(zipcode);
			query = "select * from customers where zipcode like "
					+ connection.escape(zipcode);
			console.log("SQL search for zipcode:" + query);
		}

		// Query and render the output of the DB to JSON objects
		connection.query(query, function(err, members) {
			console.log(members);
			if (!err) {
				ejs.renderFile('./views/memberList.ejs', {
					"members" : members
				}, // <--- JSON passed to EJS
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

			} else {
				console.log("Something wrong with DB MYSQL");

			}
		});

	}

});

app.listen(4000);
