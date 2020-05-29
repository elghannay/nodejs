// core modules
const fs = require('fs');
const http = require('http');
const url = require('url');
// third party modules
const slugify = require('slugify');
// local modules
const tempOverview = fs.readFileSync(`${__dirname}/templates/overview.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/card.html`, 'utf-8');

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%productName%}/g, product.productName);
  output = output.replace(/{%id%}/g, product.id);
  output = output.replace(/{%image%}/g, product.image);
  output = output.replace(/{%from%}/g, product.from);
  output = output.replace(/{%nutrients%}/g, product.nutrients);
  output = output.replace(/{%quantity%}/g, product.quantity);
  output = output.replace(/{%price%}/g, product.price);
  output = output.replace(/{%description%}/g, product.description);
  if (!product.organic) output = output.replace(/{%is-organic%}/g, 'not-organic');
  return output;
};

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map((el) => slugify(el.productName, { lower: false }));
console.log(slugs);

const server = http.createServer((req, res) => {
  const pathName = req.url;
  // true returns an object containing the query and additional info
  // from which we extracted pathname and query
  const { pathname, query } = url.parse(pathName, true);
  // OVERVIEW

  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'content-type': 'text/html' });
    // replace the placeholders in the tempCard with the current product.
    const cardHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%product-cards%}', cardHtml);
    res.end(output);
  }
  // PRODUCT
  else if (pathname === '/product') {
    res.writeHead(200, { 'content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  // API
  else if (pathname === '/api') {
    res.writeHead(200, { 'content-type': 'application/json' });
    res.end(data);
  }
  // NOT FOUND
  else {
    res.writeHead(404, { 'content-type': 'text/html' });
    res.end(`<h1>page not found</h1>`);
  }
});
server.listen('8001', () => {
  console.log('server running');
});
