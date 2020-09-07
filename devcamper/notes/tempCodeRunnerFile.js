const http = require('http');

const server = http.createServer((req, res) => {
  res.end('welcome to the page');
});
const port = 5000;

server.listen(port, () => console.log('server is listening on port 5000'));
