var PingdomAdapter = require('../adapters/PingdomAdapter');
var VersionsAdapter = require('../adapters/VersionsAdapter');
var parse = require('url').parse;
var _ = require('lodash');

var Environment = function(title, url) {
  var _this = this;
  this.title = title;
  this.url = parse(url);
};

Environment.prototype = {
  get online() {
    var status_code = PingdomAdapter.getStatus(this.url.hostname);
    return (status_code === "up");
  },

  get prettyOnline() {
    return (this.online ? "Online!" : "Offline");
  },

  get uptime() {
    return PingdomAdapter.getUptime(this.url.hostname);
  },

  get timestamp() {
    return VersionsAdapter.getTimestamp(this.url.href);
  },

  get version() {
    return VersionsAdapter.getVersion(this.url.href);
  },

  get status() {
    if(!this.version) {
      return "warn";
    }

    return (this.online ? "good" : "bad");
  }
};

module.exports = Environment;
