var express = require('express');
var router = express.Router();
var EnvironmentsController = require('../controllers/EnvironmentsController');

/* GET '/': status page. */
router.get('/', function(req, res) {
  var status = EnvironmentsController.overallStatus();
  var now = Math.round((new Date()).getTime() / 1000);

  var response = { 
    status: status,
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
  var status = "good";
  var now = Math.round((new Date()).getTime() / 1000);

  var response = { 
    status: EnvironmentsController.overallStatus(),
    environments: EnvironmentsController.all(),
    last_updated: now
  };

  console.log(JSON.stringify(response));

  res.json(response);
});

module.exports = router;
