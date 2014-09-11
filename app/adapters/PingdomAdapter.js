var request = require('request');
var moment = require('moment');

var hosts = {};

function pingdomAPI(api_path, cb) {
  var request_options = {
    'url': 'https://api.pingdom.com' + api_path,
    'auth': {
      'user': process.env.PINGDOM_USERNAME,
      'pass': process.env.PINGDOM_PASSWORD,
    },
    'headers': {
      'App-Key': 'qm434h5dfdu8yx584vrg3ucrvpbporzb'
    }
  }

  request.get(request_options, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      var json_response = JSON.parse(body.toString());
      cb(json_response);
    }

  });
}

var refreshUptime = function(hostname) {
  var id = hosts[hostname].id;
  var weekago = moment().subtract(30, 'days').unix();

  pingdomAPI('/api/2.0/summary.average/' + id + '?includeuptime=true&from=' + weekago, function(result) {
    var status = result.summary.status;
    var uptime_secs = status.totalup + status.totalunknown;
    var uptime_total_secs = status.totalup + status.totaldown + status.totalunknown;
    var uptime_percent = uptime_secs / uptime_total_secs;

    hosts[hostname].uptime = Math.floor(uptime_percent * 10000) / 100;
  });
};

var refreshOnlineStatus = function() {
  pingdomAPI('/api/2.0/checks', function(result) {
    for(i in result.checks) {
      var hostname = result.checks[i].hostname;

      hosts[hostname] = {};
      hosts[hostname].id = result.checks[i].id;
      hosts[hostname].status = result.checks[i].status;

      refreshUptime(hostname);
    }
  });
}

refreshOnlineStatus();

var getStatus = function(hostname) {
    if(hosts[hostname]) {
      return hosts[hostname].status;
    } else {
      return 'unknown';
    }
}

var getUptime = function(hostname) {
    if(hosts[hostname]) {
      return hosts[hostname].uptime;
    } else {
      return 'unknown';
    }
}

module.exports = {
  getStatus: getStatus,
  getUptime: getUptime
};
