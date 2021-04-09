const http = require('http');
const { debug } = require('console');
const app = require('./backend/app');

const normalizePort = val => {
  var port = parseInt(val,10);

  if(isNaN(port))
    return val;

    if(port >= 0)
      return port;

    return false;
};

const onError = error => {
  if(error.syscall !== 'listen')
    throw error;

const bind = typeof port === 'string' ? 'pipe ' + port : "port " + port;

switch(error.code){
  case 'EACCES' :
    console.error(bind + 'requires elevated privilages');
    process.exit(1);
  case 'EADDRINUSE':
      console.error(bind + 'is already is use');
      process.exit(1);
  default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof(port) === 'string' ? 'pipe ' + port : 'port ' + port;

  debug(" listening on " + bind);
};

const port = normalizePort(process.env.PORT || '3000');

const server = http.createServer(app);

app.set('port',port);

server.on('error', onError);
server.on('listening', onListening);
server.listen(port);
