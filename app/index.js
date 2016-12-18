/** A simple Node.js script to instantly server
 * Processing source code as Processing.js :)
 *
 * Usage: node serve-pde 8080 sketch.pde */


const http = require('http');
const url = require('url');
const fileSystem = require('fs');
const path = require('path');

const toxi = require('toxiclibsjs');

// require('../public/scripts/processing.min.js');

function send404(res) {
  res.writeHead(404);
  res.write('404');
  res.end();
}

http.createServer((request, response) => {
  const urlPath = url.parse(request.url).pathname;

  console.log('Request received ...');
  console.log(request.url);
  console.log(urlPath);

  // your normal server code

  switch (urlPath) {
    case '/':
      fileSystem.readFile(path.join(__dirname, '/html/index.html'), (error, data) => {
        if (error) {
          send404(response);
          return;
        }
        response.writeHead(200, {
          'Content-Type': 'text/html',
        })
        response.write(data, 'utf8');
        response.end();
      });
      break;
    case '/public/scripts/processing.min.js':
    case '/public/scripts/toxiclibs.min.js':
    case '/public/scripts/flocking.pde':

      console.log('loading file ');
      const filePath = path.join(__dirname, `..${request.url}`);
      const stat = fileSystem.statSync(filePath);
      response.writeHead(200, {
        'Content-Type': 'text/javascript',
        'Content-Length': stat.size,
      });
      const readStream = fileSystem.createReadStream(filePath);
      // We replaced all the event handlers with a simple call to readStream.pipe()
      readStream.pipe(response);
      break;
    default:
      send404(response);
      break;
  }
}).listen(process.argv[2]);

console.log(`Node HTTP server running at http://localhost: ${process.argv[2]} .`);

