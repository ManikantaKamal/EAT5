/**
 * Author: kamal G
 * date: 31-12-2016
 * Description: The user.js will use to do CURD operation for user tables.
 * 
 */

// dependency files initialization
var randomstring = require("randomstring");
var date = require('date-and-time');
var db = require('../db.js');
var result = require('../helper/response');
var message = require('../helper/message');
var config = require('../helper/config');
var sendMail = require('../helper/sendMail');
var base64 = require('base-64');
fs = require('fs');

module.exports = {
		
		/*
		 * create function is used to create an entry in user table in database.
		 */ 
		create: function(req,domainName,callback) {
			
			result.success = false;
	    	result.ExceptionMessage = "NULL";
	    	result.ViewModels = "NULL";
	    	result.ViewModel="NULL";
	    	result.data = "NULL";
	    	
			// check the duplicate users from data base
			//db.get().query('SELECT * FROM USER WHERE EmailId=\'' +req.EmailId +'\' AND PhoneNumber = \''+req.PhoneNumber+'\'', function (err, row) {
	    	//checking emailId is exist or not
	    	db.get().query('SELECT * FROM USer WHERE EmailId = ?', req.EmailId, function (err, row) {
				
				// if error
				if (err){
			    	result.message = message.error;
			    	result.ExceptionMessage = err;
			    	result.status = message.error;
			    	callback(result);
			    }
				else{
					// if EmailId available
					if(row.length > 0){
						result.success = false;
				    	result.message = message.user_Duplicate_Email;
				    	result.ExceptionMessage ="NULL";
				    	result.ViewModels = "NULL";
				    	result.ViewModel="NULL";
				    	result.data = "NULL";
				    	result.status = "NUll"
				    	callback(result);
					}
					// check phone numer is Already available or not
					else{
						db.get().query('SELECT * FROM USer WHERE PhoneNumber = ?', req.PhoneNumber, function (err, row) {
							// if error
							if (err){
						    	result.message = message.error;
						    	result.ExceptionMessage = err;
						    	result.status = message.error;
						    	callback(result);
						    }
							else{
								// if Phone Number available
								if(row.length > 0){
									result.success = false;
							    	result.message = message.user_Duplicate_PhoneNumber;
							    	result.ExceptionMessage ="NULL";
							    	result.ViewModels = "NULL";
							    	result.ViewModel="NULL";
							    	result.data = "NULL";
							    	result.status = "NUll"
							    	callback(result);
								}
								// no duplicate phone number and no duplicate emailId then create an user
								else{
									// generate query
									var values = [];
									
									// generate a random code as a primary key
									var code = randomstring.generate(6);
									var params = "Code";
									var operator = "?";
									values.push(code);
									
									
									params = params +',CountryCode';
									values.push(config.country_Code);
									operator = operator+",?";
									
									params = params +',Status'; 
									values.push(1);
									operator = operator+",?";
									
									params = params +',Ph_VerifiedCode'; 
									values.push(randomstring.generate(6));
									operator = operator+",?";
									
									params = params +',Password'; 
									values.push(base64.encode(req.Password));
									operator = operator+",?";
									
									params = params +',CreatedBy'
									operator = operator+",?";
									if(req.CreatedBy == null || req.CreatedBy == undefined){
										values.push('0');
									}else{
										values.push(req.CreatedBy);
									}
								
									var requestValues = Object.keys(req);
									
									for (i=0;i<requestValues.length;i++){
										if(requestValues[i] !== 'Password' && requestValues[i] !=='CreatedBy'){
											params = params + ','+requestValues[i];
											values.push(req[requestValues[i]]);
											operator = operator + ',?';
										}
									}
									
									var insert_Query = 'INSERT INTO USER ('+params+')' +'VALUES('+operator+')';
									
									// query for storing data into data base
									db.get().query(insert_Query, values, function (err, rows) {
										if (err){
									    	result.success = false;
									    	result.message = message.user_Create_Error;
									    	result.ExceptionMessage = err;
									    	result.ViewModels = "NULL";
									    	result.ViewModel="NULL";
									    	result.data = "NULL";
									    	result.status = message.error;
									    	callback(result);
									    }
										else{
											// After success get the inserted result 
											var inseartedId = rows.insertId;
											db.get().query('SELECT * FROM USER WHERE Id = ?', inseartedId, function (err, rows) {
											    if (err){
											    	//return done(err)
											    }
											    else{
											    	//calling send email fnction to send verification email
											    	fs.readFile('././views/emailVerification.html', 'utf8', function (err,data) {
											    	  if (err) {
											    	    return console.log(err);
											    	  }
											    	  
											    	  var name = rows[0].FirstName;
											    	  if(rows[0].MiddleName !== null){
											    		 name = name+" "+rows[0].MiddleName+" "+rows[0].LastName;
											    	  }else{
											    		  name = name+" "+rows[0].LastName;
											    	  }
											    	  var APIurl = 'http://'+domainName+'/api/emailVerify/'+rows[0].Code
											    	  data = data.replace(/userName/gi, name);
											    	  data = data.replace(/APIURL/gi,APIurl);
											    	  //console.log(data);
											    	  var to = rows[0].EmailId;
											    	  var subject = message.verifyEmail;
											    	  sendMail.sendMail(to,data,subject);
											    	});
											    	rows[0].Password = "NULL";
											    	result.success = true;
											    	result.message = message.user_Cretae_Success;
											    	result.ExceptionMessage = "NULL";
											    	result.ViewModels = "NULL";
													result.ViewModel= rows;
													result.data = "NULL";
											    	result.status = message.success;
											    	callback(result);
											    }
											  })
									    }
									   
									  })
									
								}
							}
							
						})
					}
				}
			})
		},
		
		/*
		 * The emailVerify function is used to verify the registered user email address based on the user Code value (Primary key)
		 */
		/*emailVerify: function(code,callback) {
			
		}*/
}