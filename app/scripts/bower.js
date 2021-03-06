var bower = require('bower'),
    path = require('path');

bower.commands
  .install([path.resolve(".")])
  .on('end', function (installed) {
    console.log(installed);
  })
  .on('error', function (err)  {
    console.error(err);
    process.exit(1);
  })
  .on('log', function (log) {
    console.log(log);
  });
