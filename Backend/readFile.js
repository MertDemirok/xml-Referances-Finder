const fs = require('fs');

module.exports.readFileXml = function readFileXml (path) {
  
    try {
        var exportXml = fs.readFileSync(path, 'utf8');
    } catch (error) {
        console.log(error);
        return "";
    }
   
    return exportXml;
}

