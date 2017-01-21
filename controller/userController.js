/**
 * Author: kamal G
 * date: 31-12-2016
 * Description: The userController will use to do CURD operation for all user tables.
 * 
 */

// dependency files initialization
var user = require('../model/user.js')

/*
 * The create function will use to handle the request and create a new recored in database for user table.
 */ 
exports.create = function(req,res){
	     var request = req.body;
	     user.create(request,req.headers.host,function(result){
			  res.json(result);
			});
};

/*
 * The emailVerify function is used to verify the registered user email address based on the user Code value (Primary key)
 */
exports.validateEmail = function(req,res){
    var code = req.params.Code;
    
    //res.sendFile('http://'+ req.headers.host +'/success_EmailVerification.html');
    __dirname = __dirname.replace ('controller','views')
    res.sendFile(__dirname+'/success_EmailVerification.html');
    
   /* user.emailVerify(code,function(result){
		  res.json(result);
		});*/
};