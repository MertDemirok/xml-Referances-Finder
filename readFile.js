const fs = require('fs');



module.exports.readFileXml = async () => {

    var exportXml = fs.readFileSync('../XmlReferanceFinder/ImportXML/ExportInfo','utf8')
    return exportXml;

    }

