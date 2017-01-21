/**
 * Author: kamal G
 * date: 11-12-2016
 * Description: The master.js will use to do CURD operation for all master tables.
 * 
 */

// dependency files initialization
var randomstring = require("randomstring");
var date = require('date-and-time');
var db = require('../db.js');
var result = require('../helper/response');
var message = require('../helper/message');

module.exports = {
		
		/*
		 * create function is used to create an entry in master table in database based on table name
		 */ 
		create: function(req,tableName,callback) {
			// query to check duplicate values
			db.get().query('SELECT * FROM '+ tableName + ' WHERE Name = ?', req.Name, function (err, row) {
		        // if duplicate value
				if(row.length > 0){
					result.success = false;
			    	result.message = message.master_Duplicate;
			    	result.ExceptionMessage ="NULL";
			    	result.ViewModels = "NULL";
			    	result.ViewModel="NULL";
			    	result.data = "NULL";
			    	result.status = "NUll"
			    	callback(result);
				}
				// no duplicate
				else{
					
					// generate a random code as a  primary key
					var code = randomstring.generate(6);
					
					var values = [];
					var requestValues = Object.keys(req);
					var params = "Code";
					var operator = "?";
					
					values.push(code);
					for (i=0;i<requestValues.length;i++){
						values.push(req[requestValues[i]]);
						params = params + ','+requestValues[i];
						operator = operator + ',?';
					}
					
					//console.log(values);
					//console.log(params);
					//console.log(operator);
					//var values = [code, req.Name,req.Status,req.CreatedBy];
					//var insert_Query = 'INSERT INTO '+tableName+'(Code, Name, Status, CreatedBy) VALUES(?,?,?,?)';
					//console.log('INSERT INTO '+tableName + '('+params+')' +'VALUES('+operator+')');
					
					var insert_Query = 'INSERT INTO '+tableName + '('+params+')' +'VALUES('+operator+')';
					
					// query for storing data into data base
					db.get().query(insert_Query, values, function (err, rows) {
						if (err){
					    	result.success = false;
					    	result.message = message.master_Create_Error;
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
							db.get().query('SELECT * FROM '+tableName+' WHERE Id = ?', inseartedId, function (err, rows) {
							    if (err){
							    	//return done(err)
							    }
							    else{
							    	result.success = true;
							    	result.message = tableName +' '+message.master_Cretae_Success;
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
			});
		  },
		  
		  /*
		   * update function is used to update an entry in master table in database based on table name and code primary key
		   */ 
		  update: function(req,tableName,code,callback) {
			// query to check duplicate values
				db.get().query('SELECT * FROM '+ tableName + ' WHERE Name = ?', req.Name, function (err, row) {
					 // if duplicate value
					if(row.length > 0 && row[0].Code !== code){
						result.success = false;
				    	result.message = message.master_Duplicate;
				    	result.ExceptionMessage ="NULL";
				    	result.ViewModels = "NULL";
				    	result.ViewModel="NULL";
				    	result.data = "NULL";
				    	result.status = "NUll"
				    	callback(result);
					}
					// no duplicate
					else{
						
						db.get().query('SELECT * FROM '+tableName+' WHERE Code = ?', code, function (err, row) {
						    if (err){
						    	//return done(err)
						    }
						    else{
						    	time = date.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
						    	
						    	var values = [];
								var requestValues = Object.keys(req);
								
								values.push(row[0].DateCreated);
								values.push(row[0].UpdateCount+1);
								values.push(time);
								
								
								var params = "DateCreated =?,UpdateCount =?,DateUpdated =?,";
								
								for (i=0;i<requestValues.length;i++){
									values.push(req[requestValues[i]]);
									if(i == requestValues.length-1){
										params = params + requestValues[i] +'=?';
									}
									else{
										params = params + requestValues[i] +'=?,';
									}
								}
								values.push(code);
								//params = params + "Code";
								
								var update_Query = "UPDATE "+ tableName +" SET " + params + " WHERE Code = ?";
								
						    	//var values = [req.name, req.status, row[0].DateCreated,req.updatedBy,row[0].UpdateCount+1,time, code];
								//var update_Query = "UPDATE "+ tableName + " SET Name = ?,Status = ?, DateCreated =?, UpdatedBy =?,UpdateCount =?,DateUpdated =? WHERE Code = ?";
								
								// query for storing data into data base
								db.get().query(update_Query, values, function (err, rows) {
									if (err){
								    	result.success = false;
								    	result.message = message.master_Update_Error;
								    	result.ExceptionMessage = err;
								    	result.ViewModels = "NULL";
								    	result.ViewModel="NULL";
								    	result.data = "NULL";
								    	result.status = message.error;
								    	callback(result);
								    }
									else{
										// After success get the inserted result 
										db.get().query('SELECT * FROM '+tableName+' WHERE Code = ?', code, function (err, rows) {
										    if (err){
										    	//return done(err)
										    }
										    else{
										    	result.success = true;
										    	result.message = tableName +' '+message.master_Update_Success;
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
						  })	
					}
				}); 
		  },
		  
		  /* 
		   * getAll function is used to get the list records from data base based on the RouteName
		   */ 
			  getAll : function(tableName, callback){
				  
				  db.get().query('SELECT * FROM '+ tableName, function (err, rows) {
					  result.success = false;
					  result.ViewModels = "NULL";
					  result.ViewModel= "NULL";
					    if (err){
					    	result.message = message.master_Get_Error;
					    	result.ExceptionMessage = err;
					    	result.status = message.error;
					    	callback(result);
					    }
					    else{
					    	result.success = true;
					    	if(rows.length > 0){
					    		result.message = message.master_Get_Success;	
					    	}
					    	else{
					    		result.message = message.master_Get_Success_NoData;
					    	}
							result.ViewModels= rows;
					    	result.status = message.success;
					    	callback(result);
					    }
					  })
			  },
			  
			  /* 
			   * getByCode function is used to get the list records from data base based on the RouteName and Code value (Primary Key)
			   */ 
			  	getByCode : function(tableName,code, callback){
					  
					  db.get().query('SELECT * FROM '+ tableName + " WHERE Code = ?", code , function (err, rows) {
						  result.success = false;
						  result.ViewModels = "NULL";
						  result.ViewModel= "NULL";
						  result.ExceptionMessage = "NULL";
						  
						    if (err){
						    	result.message = message.master_Get_Error;
						    	result.ExceptionMessage = err;
						    	result.status = message.error;
						    	callback(result);
						    }
						    else{
						    	result.success = true;
						    	if(rows.length > 0){
						    		result.message = message.master_Get_Success;	
						    	}
						    	else{
						    		result.message = message.master_Get_Success_NoData;
						    	}
								result.ViewModel= rows;
						    	result.status = message.success;
						    	callback(result);
						    }
						  })
				  },
			  /*
			   * getByParams function is used to search the data from data base based on the request params and table name
			   */ 
			  getByParams: function(req,tableName,callback) {
				  //generate query
				  var query = 'SELECT * FROM '+ tableName + ' WHERE ';
				  
				  if(req.Status == null || req.Status == undefined){
					  query = query + " Status = true "
				  }
				  else{
					  query = query + " Status = " + req.Status
				  }
				  
				  var requestValues = Object.keys(req);
				  
				  for (i=0;i<requestValues.length;i++){
					  if(requestValues[i] == 'Status'){
						  // do nothing
					  }
					  else{
						  if(requestValues[i] == 'Name'){
							  query = query + ' AND '+ requestValues[i] + ' LIKE \'%'+ req[requestValues[i]] + '%\'';
						  }
						  else{
							  query = query + ' AND '+ requestValues[i] + '= \''+ req[requestValues[i]] + '\'';
						  }
					  }	  
					}
				  
				  //console.log(query)
				  // execute query
				  db.get().query(query , function (err, rows) {
					  result.success = false;
					  result.ViewModels = "NULL";
					  result.ViewModel= "NULL";
					  result.ExceptionMessage = "NULL";
					  
					    if (err){
					    	result.message = message.master_Get_Error;
					    	result.ExceptionMessage = err;
					    	result.status = message.error;
					    	callback(result);
					    }
					    else{
					    	result.success = true;
					    	if(rows.length > 0){
					    		result.message = message.master_Get_Success;	
					    	}
					    	else{
					    		result.message = message.master_Get_Success_NoData;
					    	}
							result.ViewModels= rows;
					    	result.status = message.success;
					    	callback(result);
					    }
					  })
			},
			/* 
			   * delete function is used to delete the entry from data base based on the code (primary key)
			   */ 
			  	delete : function(tableName,code, callback){

					  db.get().query('SELECT * FROM '+ tableName + " WHERE Code = ?", code , function (err, rows) {
						  result.success = false;
						  result.ViewModels = "NULL";
						  result.ViewModel= "NULL";
						  result.ExceptionMessage = "NULL";
						  
						    if (err){
						    	result.message = message.master_Get_Error;
						    	result.ExceptionMessage = err;
						    	result.status = message.error;
						    	callback(result);
						    }
						    else{
						    	if(rows.length > 0){
						    		db.get().query('DELETE  FROM '+ tableName + " WHERE Code = ?", code , function (err, rows) {
						    			 if (err){
						    				 result.message = message.master_Get_Error;
										     result.ExceptionMessage = err;
										     result.status = message.error;
										     callback(result);
						    			 }
						    			 else{
						    				 result.success = true;
						    				 result.message = message.master_Delete_Success;
						    				 result.status = message.success;
										     callback(result);
						    			 }
						    		})
						    			
						    	}
						    	else{
						    		result.success = true;
						    		result.message = message.master_Delete_NoData;
						    		callback(result);
						    	}
								
						    	
						    }
						  })
				  }
		  
}