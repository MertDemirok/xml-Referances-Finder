var fileRead = require('./readFile');
var xmlProcesser = require('./xmlProcesser');
var jarExtract = require('./ExtractFileFromArchive');

//Process Start
module.exports.runProcess = function runProcess(excelOptions) {

  var response = getXML(excelOptions);

  return response;
};

function getXML(eO) {

  // jarExtract.ExtractFileFromArchive();
  var res = fileRead.readFileXml(eO.readPath);

  if (res !== "") {
    return xmlProcesser.xmlTransform(res, eO);

  }
}