/**
 * New node file
 */

//Validate the Admin 
function validateUser(callback,userName,Password)
{
	var mysql = require('mysql');
	console.log("Password: " + Password +"UserName: " + userName);
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '',
		port: '3306',
		database: 'VideoLibraryManagement'
	});
	connection.connect();
	var sql = "SELECT * FROM users WHERE username ='"+userName+"' and password = '"+Password+"'";
	console.log(sql);
	connection.query(sql, function(err, rows) { 
		if (err) {
			console.log("ERROR: " + err.message);
		}
		if(rows.length === 0 || userName === '' || Password ==='')
			{ 
			 err = "Not a valid user";
			}
		callback(err,rows);
			
	});
}
//Create New customer
function insertNewcustomer(callback,firstName,lastName,userName,emailId,password)
{
	var mysql = require('mysql');
	console.log("Firstname: " + firstName + "LastName: " + lastName + "Password: " + password +  "EmailId: " + emailId +"userName: " + userName);
	var connection = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : '',
		port: '3306',
		database: 'VideoLibraryManagement'
	});
	connection.connect();
	var sql = "INSERT INTO customer VALUES('"+firstName+"','"+lastName+"','"+userName+"','"+emailId+"','"+password+"')";
	console.log(sql);
	connection.query(sql, function(err, results) {
		if (err) {
			console.log("ERROR: " + err.message);
		}
		console.log(results);
		callback(err,results);
	});
}

exports.validateUser = validateUser;