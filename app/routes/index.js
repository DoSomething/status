var express = require('express');
var router = express.Router();
var EnvironmentsController = require('../controllers/EnvironmentsController');
var badge = require('gh-badges');

/* GET '/': status page. */
router.get('/', function(req, res) {
  var now = Math.round((new Date()).getTime() / 1000);

  var response = { 
    status: EnvironmentsController.overallStatus(),
    statusMessage: (status === "good" ? "All systems operational." : "Experiencing some turbulence."),
    environments: EnvironmentsController.all(),
    last_updated: now
  };

  res.render('index', response);
});

/* GET '/faq': static FAQ page. */
router.get('/faq', function(req, res) {
  res.render('faq');
});

/* GET '/api': status as JSON. */
router.get('/api', function(req, res) {
  var now = Math.round((new Date()).getTime() / 1000);

  var response = { 
    status: EnvironmentsController.overallStatus(),
    environments: EnvironmentsController.all(),
    last_updated: now
  };

  console.log(JSON.stringify(response));

  res.json(response);
});


/* GET '/api': status as JSON. */
router.get('/api/badge/:environment.svg', function(req, res) {
  var environment = EnvironmentsController.show(req.params.environment);
  console.log(environment);

  badge({
    text: [environment.title, environment.version],
    colorscheme: (environment.status === "good" ? "green" : "yellow"),
    template: "flat"
  }, function(svg) {
    res.set('Content-Type', 'image/svg+xml');
    res.send(svg);
  });
});

module.exports = router;
