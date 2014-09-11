var express = require('express');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var favicon = require('serve-favicon');
var logger = require('morgan');
var path = require('path');
var timeago = require('timeago');

var index = require('./app/routes/index');

var app = express();

var hbs = exphbs.create({
  layoutsDir: 'app/views/layouts',
  partialsDir: 'app/views/partials',
  defaultLayout: 'main',
  extname: '.hbs',
  helpers: {
    timeago: function(timestamp) { 
      var date = new Date(timestamp * 1000);
      return '<span class="timeago" title="' + date.toISOString() + '">' + timeago(date) + '</span>';
    }
  }
});

// view engine setup
app.engine('hbs', hbs.engine);
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

app.locals.timeago = timeago;

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
