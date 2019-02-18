var fileRead = require('./readFile');
var run = require('./runProcess'); // for test
var xmlProcesser = require('./xmlProcesser');
var log = require('../log');
var path = require('path');

//Process Start
module.exports.runProcess = function runProcess(excelOptions) {

    getXML(excelOptions);

};


function getXML(eO) {

  fileRead.readFileXml(eO.readPath).then(content => {

    xmlProcesser.xmlTransform(content, eO);
  });
}

//for test function
/**
 *
              var excelOptions2 = {
                oparation: "writeFiletoXlsxForReferances",
                readPath:"./ImportXML/ExportInfo",
                writePath: "./ExportToExcel/Referances.xlsx",
                sheetName : "RefSheet",
                headers : ["Proxy Service Path", "References", "Reference Resource Type", "# BS invoked", "# PX invoked"],
            };

              excelExport.runProcess(excelOptions2);

 *
 */


//run.runProcess();






