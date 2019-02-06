var http = require('http');
var fs = require('fs');
var path = require('path');
var index = require('./index');
var formidable = require('formidable');

http.createServer(function (request, response) {
    console.log('request starting...');


    var filePath = '.' + request.url;

    console.log( filePath )
    if (filePath == './')
        filePath = './index.html';
    else if (filePath == './exportxml'){
        var form = new formidable.IncomingForm();
        form.parse(request, function (err, fields, files) {
          
            var oldpath = files.xml.path;
            
           var newpath = '../XmlReferanceFinder/ImportXML/' + files.xml.name;
          
           fs.rename(oldpath, newpath, function (err) {
              if (err) throw err;
             // response.write(200, { 'Content-Type': contentType });
              console.log('File uploaded and moved!')
              index.runProcess();
             
            }); 
       });
    }


    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
        case '.wav':
            contentType = 'audio/wav';
            break;
    }

    fs.readFile(filePath, function(error, content) {
        if (error) {
            if(error.code == 'ENOENT'){
                fs.readFile('./404.html', function(error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                response.end();
            }
        }
        else {
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });

}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');