// Write Referances.xlsx
var excel = require('excel4node');
var fs = require('fs');

module.exports.writeFiletoXlsx = function writeFiletoXlsx(params) {

    //console.log(params)
    var workbook = new excel.Workbook();
    var worksheet = workbook.addWorksheet('Sheet 1');
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

    //worksheet Header set
    worksheet.cell(1, 2).string('Proxy Service Path').style(myStyle)
    worksheet.cell(1, 3).string('References').style(myStyle)
    worksheet.cell(1, 4).string('Reference Resource Type').style(myStyle)
    worksheet.cell(1, 5).string('# BS invoked').style(myStyle)
    worksheet.cell(1, 6).string('# PX invoked').style(myStyle)


    var itemCount = 0;
    var itemCountforResource = 0;
    var resourceTypeInfo = [];
    //worksheet data set

    params.forEach(function (param, i) {

        var attrs = param.attr;
        var props = param['imp:properties']['imp:property'];
        var refData = '';
        var psCount = 0;
        var bsCount = 0;

        if (attrs.typeId === "ProxyService") {

            props.forEach(function (ref) {

                if (ref.attr.name === "extrefs") {

                    //2. column
                    //console.log("Proxy Service Path : ", attrs.instanceId)
                    worksheet.cell(itemCount + 2, 2).string(attrs.instanceId);

                    //3. column
                    refData = ref.attr.value.toString();
                    //console.log("ref.attr.value => ", refData)

                    var referancePath = refData.slice(refData.lastIndexOf('OSB_Applications', '$')).replace(/\$/g, '/');
                    //console.log("Referance : ", referancePath);
                    worksheet.cell(itemCount + 2, 3).string(referancePath);

                    //4. column
                    var resourceType = refData.split('$')[0];
                    //console.log("Reference Resource Type : ", resourceType);
                    worksheet.cell(itemCount + 2, 4).string(resourceType);

                    if (resourceType === "BusinessService") {

                        resourceTypeInfo[i] = { bsCount: ++bsCount, psCount: psCount  }

                    } else if (resourceType === "ProxyService") {
                        resourceTypeInfo[i] = { psCount: ++psCount ,bsCount: bsCount  }

                    }else{
                        resourceTypeInfo[i] = { psCount: psCount ,bsCount: bsCount  }
                       
                    }
                   
                       
                    itemCount += 1;
                }

                
            });

            props.forEach(function (ref) {

                if (ref.attr.name === "extrefs") {
   
                resourceTypeInfo.forEach(element => {
            
                    worksheet.cell(itemCountforResource + 2, 5).number(element.bsCount);
                    worksheet.cell(itemCountforResource + 2, 6).number(element.psCount);
    
                });
                   
               
                itemCountforResource += 1;
                }
    
            });
            
  
        
        }

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

    workbook.write('../XmlReferanceFinder/ExportToExcel/Referances.xlsx', function (err, stats) {
        if (err) {
            console.error(err);
        } else {
            console.log(" Referances.xlsx Done :) \n", stats); // Prints out an instance of a node.js fs.Stats object
        }
    });

}




