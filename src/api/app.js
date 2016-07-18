var restify = require('restify');

function respond(req, res, next) {
  res.send(req.files);
  next();
}

var server = restify.createServer();
server.use(restify.bodyParser());
server.post('/upload', respond);

server.listen(process.env.PORT, function() {
  console.log('%s listening at %s', server.name, server.url);
});