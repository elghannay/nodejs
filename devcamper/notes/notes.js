// when you add res.end() the status code 200 is automatically returned.
// the request response cycle.
const http = require('http');
const data = {
  name: 1,
  value: 'x',
};

const server = http.createServer((req, res) => {
  //   res.setHeader('Content-Type', 'text/html');
  //   //   to add custom data in the header always start with X
  //   res.setHeader('X-Powered-By', 'node js');
  //   res.statusCode = 200;
  // all of the code above could be condensed in one method
  res.writeHead(200, {
    'Content-Type': 'text/html',
    'X-Powered-By': 'node js',
  });
  res.end(
    JSON.stringify({
      success: true,
      data,
    })
  );
});
const port = 3000;

server.listen(port, () => console.log('server is listening on port 5000'));
// status codes 400, if for example an email was required and you didn't
// provide it you will get a bad request error
