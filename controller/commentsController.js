/**
 * Author: kamal G
 * date: 02-12-2016
 * Description: The commentsController will use to do CURD operation for post comments.
 * 
 */

// dependency files initialization
var comment = require('../model/comments.js')


/*
 * The create function will use to handle the request and create a new recored in database
 */ 
exports.create = function(req,res){
	     var request = req.body;
	     comment.create(request,function(result){
			  res.json(result);
			});
};

/*
 * This getByPostCode function is to get the list of comments based on the post Code
 */
exports.getByPostCode = function(req,res){
    var postCode = req.params.PostCode;
    comment.getByPostCode(postCode,function(result){
		  res.json(result);
		});
};