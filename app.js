var http = require('http');
var fs = require('fs');
var path = require('path');
var excelExport = require('./Backend/runProcess');
var formidable = require('formidable');

http.createServer(function (request, response) {
    console.log('request starting...');

    var filePath = '.' + request.url;

    if (filePath == './')
        filePath = './index.html';
    else if (filePath == './ExportToExcel') {
        var form = new formidable.IncomingForm();

        form.parse(request, function (err, fields, files) {

            if(files !== undefined){
                var oldpath = files.xml.path;
          
           

            var newpath = './ImportXML/' + files.xml.name;

            fs.rename(oldpath, newpath, function (err) {
                if (err) throw err;
                // response.write(200, { 'Content-Type': contentType });
                console.log('File uploaded and moved!');

                /** 
                 * 
                 * 
                 *  // will be trigger click button  
                var Resources = {
                  oparation: "writeFiletoXlsxForPath",
                  readPath:"./ImportXML/ExportInfo",
                  writePath: "./ExportToExcel/other/Resources.xlsx",
                  sheetName : "Proxy Service Path",
                  localProjectPath:"",
                  serviceType:"ProxyService",
                  repateStatus: false,
                  headers : ["Proxy Service Path"],
              };
  
         
  
                var Referances = {
                  oparation: "writeFiletoXlsxForReferances",
                  readPath:"./ImportXML/ExportInfo",
                  writePath: "./ExportToExcel/Referances.xlsx",
                  sheetName : "RefSheet",
                  localProjectPath:"",
                  serviceType:"ProxyService",
                  repateStatus: false,
                  headers : ["Proxy Service Path", "References", "Reference Resource Type", "# BS invoked", "# PX invoked"],
              }; 
    



     var ProxyService = {
                    oparation: "findEndPoints",
                    readPath: "./ImportXML/ExportInfo",
                    writePath: "./ExportToExcel/other/EndPoints_ProxyService.xlsx",
                    localProjectPath: "C:/Users/mert.demirok/Desktop",
                    serviceType: "ProxyService",
                    repateStatus: false,
                    headers: ["Proxy Service Path", "EndPoints"],
                };


                
                var BusinessService = {
                    oparation: "findEndPoints",
                    readPath: "./ImportXML/ExportInfo",
                    writePath: "./ExportToExcel/other/EndPoints_BusinessService.xlsx",
                    localProjectPath: "C:/Users/mert.demirok/Desktop",
                    serviceType: "BusinessService",
                    repateStatus: false,
                    headers: ["Proxy Service Path", "EndPoints"],
                };

                
                */

               var Referances = {
                oparation: "writeFiletoXlsxForReferances",
                readPath:"./ImportXML/ExportInfo",
                writePath: "./ExportToExcel/Referances.xlsx",
                sheetName : "RefSheet",
                localProjectPath:"",
                serviceType:"ProxyService",
                repateStatus: false,
                headers : ["Proxy Service Path", "References", "Reference Resource Type", "# BS invoked", "# PX invoked"],
            }; 
         

                var response = excelExport.runProcess(Referances);
                console.log("One Iteration | Status:", response);
               

            });
           
        }  
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

    fs.readFile(filePath, function (error, content) {
        if (error) {
            if (error.code == 'ENOENT') {
                fs.readFile('./404.html', function (error, content) {
                    response.writeHead(200, { 'Content-Type': contentType });
                    response.end(content, 'utf-8');
                });
            }
            else {
                response.writeHead(500);
                response.end('Sorry, check with the site admin for error: ' + error.code + ' ..\n');
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