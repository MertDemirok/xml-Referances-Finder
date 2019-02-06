// Write Referances.xlsx
var excel = require('excel4node');
var fs = require('fs');

module.exports.writeFiletoXlsx = function writeFiletoXlsx(params) {
  // Create a new instance of a Workbook class

  //console.log(params)
    var workbook = new excel.Workbook();
    var worksheet = workbook.addWorksheet('Sheet 1');

      //worksheet Header set
    worksheet.cell(1,2).string('Path').style({font: {color: '#FF0800', bold: true}})
    worksheet.cell(1,3).string('Type').style({font: {color: '#FF0800', bold: true}})
    worksheet.cell(1,4).string('Referances').style({font: {color: '#FF0800', bold: true}})
    
    

    //worksheet data set
params.forEach(function (element, i) {

        console.log(i ,"------------------------------------------------------------------------------")
            var elements =  element;
            var attrs = elements.attr; 
            var data =  '';
            worksheet.cell(i+2,1).number(i).style({font: { bold: true, horizontal: 'center'}});
        console.log("Path : ",attrs.instanceId)
        console.log("Type : ",attrs.typeId)

        worksheet.cell(i+2,2).string(attrs.instanceId)
        worksheet.cell(i+2,3).string(attrs.typeId)

        var props = elements['imp:properties']['imp:property'];
            props.forEach( function(ref , r) {
                if(ref.attr.name === "extrefs"){
                    
             console.log("Referance : ",ref.attr.value )
             data +=  ref.attr.value.toString()+" \n ";
             
            // console.log("Referance--> : ",data)
          
                }
            });

            worksheet.cell(i+2,4).string(data.replace(/\$/g,'/')); 
        });

        try {
            // Query the entry
            var stats = fs.lstatSync('../XmlReferanceFinder/ExportToExcel/Referances.xlsx');

            // Is it a directory?
            if (stats.isDirectory()) {
                fs.unlink('../XmlReferanceFinder/ExportToExcel/Referances.xlsx', function (err) {
                    if (err) throw err;
                    // if no error, file has been deleted successfully
                    console.log('File deleted!');
                });   
            }
        }
        catch (e) {
            console.log('File not exist!');
        }  

   workbook.write('../XmlReferanceFinder/ExportToExcel/Referances.xlsx' , function(err, stats) {
    if (err) {
        console.error(err);
    } else {
        console.log(" Referances.xlsx Done :) \n",stats); // Prints out an instance of a node.js fs.Stats object
    }
    });

}








 