// Write Referances.xlsx
var excel = require('excel4node');
var fs = require('fs');
var exports = module.exports = {};
var path = require('path');

exports.writeFile = function (params, opt) {

    var workbook = new excel.Workbook();
    var worksheet = "";
    switch (opt.oparation) {
        case "writeFiletoXlsxForReferances":

            worksheet = ExcelFormat(workbook, opt);
            writeFiletoXlsxForReferances(params, worksheet);
            break;
        case "writeFiletoXlsxForPath":

            worksheet = ExcelFormat(workbook, opt);
            writeFiletoXlsxForPath(params, worksheet);
            break;

        case "findEndPoints":

            worksheet = ExcelFormat(workbook, opt);
            writeFiletoXlsxForEndPoint(params, worksheet, opt);
            break;
        default:
            console.log('SwitchCase default!');
            break;
    }


    if (worksheet !== "") {

        try {
            // Query the entry
            var stats = fs.lstatSync(opt.writePath);

            // Is it a directory?
            if (stats.isDirectory()) {
                fs.unlink(opt.writePath, function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log('File deleted!');
                });
            }
        }
        catch (e) {
            console.log('File not exist!');
        }

        workbook.write(opt.writePath, function (err, stats) {
            if (err) {
                console.error(err);
            } else {
                console.log(opt.writePath, " Done :) \n", stats); // Prints out an instance of a node.js fs.Stats object
            }
        });

    } else {
        console.log("code:1050 Bir hata oluştu!!")
    }

    //Proccess Finish
}


function writeFiletoXlsxForEndPoint(params, worksheet, excelOptions) {

    var path_List = []


    params.forEach(function (data, i) {

        
        var path_Data = data.path;
       
        path_List.push(path_Data);


        worksheet.cell(i + 2, 2).string(path_Data);

    });

    var endpointPath = getPath(path_List, excelOptions);
    console.log(endpointPath);

    
    
}



function getPath(params, excelOptions) {

  
    var EndPointpath = [];
    for (let i = 0; i < params.length; i++) {
        const element = params[i];

        EndPointpath[i] = excelOptions.localProjectPath + "/" + element;
      
        if (excelOptions.serviceType === "ProxyService") {
           
            EndPointpath[i] = EndPointpath[i].concat('.ProxyService');
        } else if (excelOptions.serviceType === "BusinessService") {

            EndPointpath[i] = EndPointpath[i].concat('.BusinessService');
        }
        
    }
 
    return EndPointpath;
}

function findEndPoints(params) {

}

function writeFiletoXlsxForReferances(params, worksheet) {
    var counter = 0;

    params.forEach(function (data) {

        var types = data.resourceType;
        var refs = data.referances;

        refs.forEach(function (ref, i) {

            worksheet.cell(counter + 2, 1).string(data.path);
            worksheet.cell(counter + 2, 2).string(ref);
            worksheet.cell(counter + 2, 4).number(data.bsCount);
            worksheet.cell(counter + 2, 5).number(data.psCount);
            worksheet.cell(counter + 2, 3).string(types[i]);

            ++counter;
        });
    });

    // console.log(params);
}

function writeFiletoXlsxForPath(params, worksheet) {

    params.forEach(function (data, i) {
        worksheet.cell(i + 2, 1).string(data.path);

    });

    console.log('Path Done !');
    return worksheet;
}


function ExcelFormat(workbook, params) {


    var sheetName = params.sheetName;
    var headers = params.headers;
    var style = ""; // şimdilik burada kalsın.


    var worksheet = workbook.addWorksheet(sheetName);
    var myStyle = workbook.createStyle({
        font: {
            bold: true,
            underline: false,
            color: '#FFFFFF',
        },
        fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: '2172d7',
            // bgColor: 'ffffff' // bgColor only applies on patternTypes other than solid.
        },
    });

    //Worksheet Header set
    headers.forEach(function (header, i) {
        worksheet.cell(1, i + 1).string(header).style(myStyle);
    });

    return worksheet;

}









