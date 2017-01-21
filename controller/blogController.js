/**
 * Author: kamal G
 * date: 08-12-2016
 * Description: The blogController will use to do CURD operation for blog posts.
 * 
 */

// dependency files initialization
var blog = require('../model/blog.js');


/*
 * The create function will use to handle the request and create a new recored in database
 */ 
exports.create = function(req,res){
	     var request = req.body;
	     blog.create(request,function(result){
			  res.json(result);
			});
};