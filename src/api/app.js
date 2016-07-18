
'use strict';

const restify = require('restify'),
      container = require('./container')
      ;

function respond(req, res, next) {
  const path = req.files.xlsx.path;
  container.parse(path)
    .then((worksheet) => {
      res.send(worksheet);
      next();
    })
    .catch((err) => {
      console.log(err);
      res.send(401);
      next(false);
    })
    ;
}

function settings(req, res, next) {
  container.settings(req.body)
    .then((worksheet) => {
      res.send(worksheet);
      next();
    })
    .catch((err) => {
      console.log(err);
      res.send(401);
      next(false);
    })
    ;
}

var server = restify.createServer();
server.use(restify.bodyParser());
server.post('/upload', respond);
server.post('/settings', settings);

server.listen(process.env.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});