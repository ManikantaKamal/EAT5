/**
 * Author: kamal G
 * date: 11-12-2016
 * Description: The masterController will use to do CURD operation for all master tables.
 * 
 */

// dependency files initialization
var master = require('../model/master.js')

/*
 * The create function will use to handle the request and create a new recored in database for master tables based on Routename
 */ 
exports.create = function(req,res){
	     var request = req.body;
	     var tableName = req.params.RouteName;
	     master.create(request,tableName,function(result){
			  res.json(result);
			});
};

/*
 * The update function will use to handle the request and update the recored in database for master tables based on Route name and code value (primary Key)
 */ 
exports.update = function(req,res){
	     var request = req.body;
	     var tableName = req.params.RouteName;
	     var code = req.params.Code;
	     master.update(request,tableName,code,function(result){
			  res.json(result);
			});
};

/*
 * The getAll function is used to fetch the all records from Data base based on the RouteName
 */ 
exports.getAll = function(req,res){
	     var tableName = req.params.RouteName;
	     master.getAll(tableName,function(result){
			  res.json(result);
			});
};

/*
 * The getByCode function is used to fetch the records from Data base based on the RouteName and Code value (Primary key)
 */
exports.getByCode = function(req,res){
    var tableName = req.params.RouteName;
    var code = req.params.Code;
    master.getByCode(tableName,code,function(result){
		  res.json(result);
		});
};

/*
 * The getByParams function will use to used to get the records from data base based on the given search criteria and Routename
 */ 
exports.getByParams = function(req,res){
	     var request = req.body;
	     var tableName = req.params.RouteName;
	     master.getByParams(request,tableName,function(result){
			  res.json(result);
			});
};

/*
 * The delete function will use to delete the entry from data base based on the Route Name and code (primary key) 
 */ 
exports.delete = function(req,res){
	     var tableName = req.params.RouteName;
	     var code = req.params.Code;
	     master.delete(tableName,code,function(result){
			  res.json(result);
			});
};