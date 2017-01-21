/**
 * Author: kamal G
 * date: 08-12-2016
 * Description: The blog.js will use to do CURD operation for blog posts by connecting to data base.
 * 
 */

// dependency files initialization
var randomstring = require("randomstring");
var db = require('../db.js')
var result = require('../helper/response');
var message = require('../helper/message');

module.exports = {
		
		/*
		 * create function is used to create an entry in posts table in database
		 */ 
		create: function(req,callback) {
	
			// generate a random code as a  primary key
			var code = randomstring.generate(6);
			var values = [code, req.title,req.short_Description,req.describtion,req.status,req.createdBy];
			
			// query for storing data into data base
			db.get().query('INSERT INTO posts (Code,Title,ShortDescription,Describtion,Status,CreatedBy) VALUES(?,?,?,?,?,?)', values, function (err, rows) {
				if (err){
			    	result.success = false;
			    	result.message = message.post_Createe_Error;
			    	result.ExceptionMessage = err;
			    	result.status = message.error;
			    	callback(result);
			    }
				else{
					// After success get the inserted result 
					var inseartedId = rows.insertId;
			    	
					db.get().query('SELECT * FROM posts WHERE Id = ?', inseartedId, function (err, rows) {
					    if (err){
					    	//return done(err)
					    }
					    else{
					    	result.success = true;
					    	result.message = message.post_Cretae_Success;
							result.ViewModel= rows;
					    	result.status = message.success;
					    	callback(result);
					    }
					  })
			    }
			   
			  })
		  },
}