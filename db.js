var mysql = require('mysql')
var async = require('async')
var config = require('./helper/config')

var PRODUCTION_DB = config.db_Name
  , TEST_DB = 'app_test_database'

exports.MODE_TEST = 'mode_test'
exports.MODE_PRODUCTION = 'mode_production'

var state = {
  pool: null,
  mode: null,
}

exports.connect = function(mode, done) {
  state.pool = mysql.createPool({
    host: config.db_Host,
    user: config.db_User,
    password: config.db_Password,
    database: mode === exports.MODE_PRODUCTION ? PRODUCTION_DB : TEST_DB
  })

  state.mode = mode
  done()
}

exports.get = function() {
  return state.pool
}
