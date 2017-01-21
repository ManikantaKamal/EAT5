/**
 * Author: kamal G
 * date: 02-12-2016
 * Description: The comments.js will use to do CURD operation for post comments by connecting to data base.
 * 
 */

// dependency files initialization
var randomstring = require("randomstring");
var db = require('../db.js');
var result = require('../helper/response');
var message = require('../helper/message');

module.exports = {
		
		/*
		 * create function is used to create an entry in comments table in database
		 */ 
		create: function(req,callback) {
	
			// generate a random code as a  primary key
			var code = randomstring.generate(6);
			var values = [code, req.comment,req.postCode,req.commentedBy,req.status];
			
			// query for storing data into data base
			db.get().query('INSERT INTO comments (Code, Comment, PostCode,CommentedBy,Status) VALUES(?,?,?,?,?)', values, function (err, rows) {
				if (err){
			    	result.success = false;
			    	result.message = message.comment_Create_Error;
			    	result.ExceptionMessage = err;
			    	result.status = message.error;
			    	callback(result);
			    }
				else{
					// After success get the inserted result 
					var inseartedId = rows.insertId;
			    	
					db.get().query('SELECT * FROM comments WHERE Id = ?', inseartedId, function (err, rows) {
					    if (err){
					    	//return done(err)
					    }
					    else{
					    	result.success = true;
					    	result.message = message.comment_Cretae_Success;
							result.ViewModel= rows;
					    	result.status = message.success;
					    	callback(result);
					    }
					  })
			    }
			   
			  })
		  },
		  
		 /* 
		  * getByPostCode function is used to get the list comments based on post code from data base
		  */ 
		  getByPostCode : function(req, callback){
			  
			  db.get().query('SELECT * FROM comments WHERE PostCode = ? AND Status = true', req, function (err, rows) {
				    if (err){
				    	result.success = false;
				    	result.message = message.comment_Get_Error;
						result.ViewModel= "";
				    	result.status = message.error;
				    	result.ExceptionMessage = err;
				    	callback(result);
				    }
				    else{
				    	result.success = true;
				    	if(rows.length > 0){
				    		result.message = message.comment_Get_Success;	
				    	}
				    	else{
				    		result.message = message.comment_Get_Success_NoData;
				    	}
						result.ViewModel= rows;
				    	result.status = message.success;
				    	callback(result);
				    }
				  })
		  }
}