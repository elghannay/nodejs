////////////////////////////////////////////////
/////////// playing with files /////////////////
///////////////////////////////////////////////
const path = require('path');
const fs = require('fs');
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// const textOut = `this what we know about the avocado ${textIn} \n created on ${Date.now()}`;
// console.log(textOut);
// fs.writeFileSync('./txt/out.txt', textOut);
// it is a bad practice to use synchronized functions in node.

fs.readFile(path.join(__dirname, './txt/input.txt'), 'utf-8', (err, data) => {
  if (err) console.log(err);
  console.log(data);
  fs.writeFile(path.join(__dirname, './txt/inputdsddw.txt'), data, (err, data) => {
    console.log('writing file ...');
    console.log(data);
  });
});
console.log('this code will run first');

////////////////////////////////////////////////
/////////// creating a server /////////////////
///////////////////////////////////////////////

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

////////////////////////////////////////////////
///////////   creating an Api  /////////////////
///////////////////////////////////////////////

const fs = require('fs');
const http = require('http');
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
// console.log(JSON.parse(data));
const server = http.createServer((req, res) => {
  // the url method will parse the link parameter into a nice object
  const pathName = req.url;
  // a simplified routing logic that can be handled with Express js
  if (pathName === '/' || pathName === '/overview') res.end('you are requesting the overview page');
  else if (pathName === '/products') res.end('you are requesting the product page');
  else if (pathName === '/api') {
    res.writeHead(200, {
      'content-type': 'application/json',
    });
    res.end(data);
  } else {
    res.writeHead(404, {
      'content-type': 'text/html',
      myOwnContent: 'this is it',
    });
    res.end(`<h1>page not found</h1>`);
  }
});
server.listen('8000', () => {
  console.log('server running');
});
