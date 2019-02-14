var fileRead = require('./readFile');
var run = require('./runProcess'); // for test
var xmlProcesser = require('./xmlProcesser');
var log = require('../log')


//Process Start
module.exports.runProcess = function runProcess(writePath,ReadPath){
  
    getXML(writePath,ReadPath);
   // getXML("new file name");

};


function getXML(wPath,rPath) {

    fileRead.readFileXml(wPath).then( content => {
      
    xmlProcesser.xmlTransform(content,rPath);
  });
}

//for test function
//run.runProcess("../ImportXML/ExportInfo","../ExportToExcel/Referances.xlsx");






