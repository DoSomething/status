var Environment = require("../models/Environment");

var Environments = {
  "us_prod": new Environment("US Production", "https://www.dosomething.org"),
  "us_staging": new Environment("US Staging", "http://staging.beta.dosomething.org"),
  "us_qa": new Environment("US QA", "http://qa.dosomething.org"),
};

module.exports = {
  all: function() {
    return Environments;
  },

  overallStatus: function() {
    for(e in Environments) {
      if(Environments[e].status !== "good") {
        return "unstable";
      } 
    };
    
    return "good";
  },

  show: function(id) {
    if(Environments.hasOwnProperty(id)) {
      return Environments[id];
    } else {
      return {
        'title': id,
        'version': 'Unknown Environment',
        'status': 'bad'
      }
    }
  }
};
