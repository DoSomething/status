var request = require('request');

var hosts = {};

function checkVersion(url) {
  request(url + 'VERSION', function(error, response, body) {
    if(!error && response.statusCode == 200) {
      var version = body.replace(/(\r\n|\n|\r)/gm, "");
      hosts[url].version = version;
    }
  });
}

function checkTimestamp(url) {
  request(url + 'TIMESTAMP', function(error, response, body) {
    if(!error && response.statusCode == 200) {
      var timestamp = body.replace(/(\r\n|\n|\r)/gm, "");
      hosts[url].timestamp = timestamp;
    }
  });
}

function checkAll() {
  for(host in hosts) {
    checkVersion(host);
    checkTimestamp(host);
  }
}

var getVersion = function(url) {
  if(!hosts[url]) {
    hosts[url] = {};
    checkVersion(url);
    checkTimestamp(url);
  }

  return hosts[url].version;
}

var getTimestamp = function(url) {
  if(!hosts[url]) {
    hosts[url] = {};
    checkVersion(url);
    checkTimestamp(url);
  }

  return hosts[url].timestamp;
}

setInterval(function() {
  checkAll();
}, 60 * 1000);

module.exports = {
  getVersion: getVersion,
  getTimestamp: getTimestamp,
  checkAll: checkAll
};
