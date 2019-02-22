var http = require('http');
var fs = require('fs');
var path = require('path');
var excelExport = require('./Backend/runProcess');

var formidable = require('formidable');
const express = require('express');





http.createServer(function (request, response) {
    console.log('request starting...');

    var filePath = '.' + request.url;

    if (filePath == './') {
        filePath = './index.html';
    } else if (filePath == './ExportToExcel') {

        var form = new formidable.IncomingForm();
        form.parse(request);

        form.on('fileBegin', function (name, file) {
            file.path = __dirname + '/ImportXML/' + file.name;
        });

        form.on('file', function (name, file) {
            console.log('Uploaded ' + file.name);
        });

        filePath = './index.html';

    } else if (filePath == './options') {

        var type = "";
        var header = [];
        var localPath = "";
        var sheetName = "";
        var write_Path = "";

        const { headers, method, url } = request;
        let body = [];
        request.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            // At this point, we have the headers, method, url and body, and can now
            // do whatever we need to in order to respond to this request.

            var responseData = JSON.parse(body);

            if (responseData.oparation == "findEndPoints") {
                header = ["Proxy Service Path", "EndPoints"];
                sheetName = "EndPoints";
                type = responseData.serviceType;
                localPath = responseData.localProjectPath;
                write_Path = "./ExportToExcel/other/EndPoints_" + type + ".xlsx";
            } else if (responseData.oparation == "writeFiletoXlsxForReferances") {
                header = ["Proxy Service Path", "References", "Reference Resource Type", "# BS invoked", "# PX invoked"];
                localPath = "";
                sheetName = "Referances";
                type = "ProxyService";
                write_Path = "./ExportToExcel/Referances.xlsx";
            } else if (responseData.oparation == "writeFiletoXlsxForPath") {
                header = ["Proxy Service Path"];
                localPath = "";
                sheetName = "Resources";
                type = "ProxyService";
                write_Path = "./ExportToExcel/other/Resources.xlsx";
            }

            var options = {
                oparation: responseData.oparation,
                readPath: "./ImportXML/ExportInfo",
                writePath: write_Path,
                localProjectPath: localPath,
                repateStatus: false,
                headers: header,
                sheetName: sheetName,
                serviceType: type
            }


            var response = excelExport.runProcess(options);
            console.log("One Iteration | Status:", response);
            console.log(options);

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
            response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8125');
            response.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:8126');
            response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
            response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
            response.setHeader('Access-Control-Allow-Credentials', true);
            response.writeHead(200, { 'Content-Type': contentType });
            response.end(content, 'utf-8');
        }
    });


}).listen(8125);
console.log('Server running at http://127.0.0.1:8125/');


