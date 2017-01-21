
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var controller = require('./controller');
var db = require('./db')
var router = express.Router();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({'extended':'true'})); 
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
//app.use(require('./middleware/users'))

// controllers files initialization


var comments = require('./controller/commentsController');
var blog = require('./controller/blogController');
var master = require('./controller/masterController');
var user = require('./controller/userController');

/* ******* routes start ************ */



// comments routes
app.post('/api/comment',comments.create)
app.get('/api/comment/:PostCode',comments.getByPostCode)

// Blog post routes
app.post('/api/post',blog.create)

//user routes
app.post('/api/user/0', user.create)
app.get('/api/emailVerify/:Code',user.validateEmail)

// master routes for country/role etc...
app.post('/api/master/:RouteName/0', master.create)
app.put('/api/master/:RouteName/:Code', master.update)
app.get('/api/master/:RouteName',master.getAll)
app.get('/api/master/:RouteName/:Code',master.getByCode)
app.post('/api/master/:RouteName',master.getByParams)
app.delete('/api/master/:RouteName/:Code',master.delete)

// routing for angularJs
app.get('*', function(req, res) {
    res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

/* ******* routes end ************ */


//Connect to MySQL on start
db.connect(db.MODE_PRODUCTION, function(err) {
  if (err) {
    console.log('Unable to connect to MySQL.')
    process.exit(1)
  } else {
   // app.listen(3000, function() { console.log('');})
  }
})

app.listen(3000);
console.log('application is running in port : 3000');

