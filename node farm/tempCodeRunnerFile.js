const http = require('http');
const server = http.createServer((req, res) => {
  // when a request comes in, the server will respond by letting node firing an event
  const pathName = req.url;
  if (pathName === '/' || pathName === '/overview') res.end('you are requesting the overview page');
  else if (pathName === '/products') res.end('you are requesting the product page');
  else {
    // the order of these two instructions does matter.
    // always send the header before the content of the response
    res.writeHead(404, {
      'content-type': 'text/html',
      myOwnContent: 'this is it',
    });
    // http header is a piece of information about the response that we are sending back
    res.end(`<h1>page not found</h1>`);
  }
  res.end('here is a response from the server');
});
// listening for incoming requests on http://127.0.0.1:8000/ the host can be added
// but in this case i have omitted it.
server.listen('8000', () => {
  console.log('server running');
});