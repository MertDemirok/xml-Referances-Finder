// Write Referances.xlsx
var excel = require('excel4node');
var fs = require('fs');
var excelExport = require('./runProcess');
var exports = module.exports = {};

exports.writeFile = function (params, opt) {
    const logStatus = "";
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
            worksheet = writeFiletoXlsxForEndPoint(params, worksheet, opt);

            break;
        default:
            console.log('SwitchCase default!');
            break;
    }

    if (worksheet !== "") {

        try {

            
            workbook.write(opt.writePath, function (err, stats) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(opt.writePath , " Done :) \n" , stats);
                   
                    console.log("-".repeat(200));
                    return "";
                }
            });

        }
        catch (e) {
            console.log("Excel Write Error: ", e);
        }

    } else {
        console.log("worksheet empty!")
    }

    //Proccess Finish
    return "Success";
}


function writeFiletoXlsxForEndPoint(params, worksheet, excelOptions) {

    params.forEach(function (data, i) {

        var path_Data = data.path;
        if (path_Data !== "WSX/business/CurrencyConverter" && path_Data !== "WSX/proxy/CurrencyConverter") {
          
            worksheet.cell(i + 2, 1).string(path_Data);
            var resEndpointPath = getPath(path_Data, excelOptions);

            //recuersive progress
            var endpointUrl = findEndPoints(resEndpointPath, excelOptions);
            worksheet.cell(i + 2, 2).string(endpointUrl);

        }
    });

    return worksheet;
}



function getPath(param, excelOptions) {

    var EndPointpath = '';

    const element = pathFixing(param);
    EndPointpath = excelOptions.localProjectPath + "/" + element;

    if (excelOptions.serviceType === "ProxyService") {

        EndPointpath = EndPointpath.concat('.ProxyService');
    } else if (excelOptions.serviceType === "BusinessService") {

        EndPointpath = EndPointpath.concat('.BusinessService');
    }

    return EndPointpath;
}

function pathFixing(pathD) {
    var fpath = [];
    var fixPath = pathD.split('/');
  
    for (let i = 0; i < fixPath.length; i++) {
        if (fixPath[i].length > 40) {
         //   console.log("path Fix: "+ fixPath[i]);
            fixPath[i] = fixPath[i].substring(0, 40);
            fpath[i] = fixPath[i];
           
        } else {
            fpath[i] = fixPath[i];
        }
    }

    return fpath.join("/");
}

function findEndPoints(localpath, eO) {

    var endpointConfig = '';
    eO.repateStatus = true;
    eO.readPath = localpath;

    endpointConfig = excelExport.runProcess(eO);
    return endpointConfig;
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









