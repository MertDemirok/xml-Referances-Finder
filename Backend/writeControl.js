// Write Referances.xlsx
var excel = require('excel4node');
var fs = require('fs');
var exports = module.exports = {};


exports.writeFile = function (params, opt) {

    
  var _excel =  ExcelFormat(opt);
  
  writeFiletoXlsx(params,_excel.ws);

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
    
        _excel.wb.write(opt.writePath, function (err, stats) {
            if (err) {
                console.error(err);
            } else {
                console.log(opt.writePath," Done :) \n", stats); // Prints out an instance of a node.js fs.Stats object
            }
        }); 
//Proccess Finish
}

 function writeFiletoXlsx(params,worksheet) {
    var counter=0;

    params.forEach(function (data) {
      
        var types = data.resourceType;
        var refs = data.referances;
        
        refs.forEach(function (ref,i) {

            worksheet.cell(counter + 2, 1).string(data.path);
            worksheet.cell(counter + 2, 2).string(ref);
            worksheet.cell(counter + 2, 4).number(data.bsCount);
            worksheet.cell(counter + 2, 5).number(data.psCount);
            worksheet.cell(counter + 2, 3).string(types[i]);
           
            ++counter;
        });
    });

     console.log(params)
     return worksheet;
}

function ExcelFormat(params) {

    
    var sheetName = params.sheetName;
    var headers = params.headers;
    var style = ""; // şimdilik burada kalsın.
  
    var workbook = new excel.Workbook();
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
    headers.forEach(function(header,i) {
        worksheet.cell(1, i+1).string(header).style(myStyle)
        
    });

   return {wb:workbook,ws:worksheet};

}









