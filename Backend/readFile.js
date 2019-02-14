const fs = require('fs');

module.exports.readFileXml = async (path) => {
  
    try {
        var exportXml = fs.readFileSync(path, 'utf8')
    } catch (error) {
        console.log("Error:",error)
    }
   
    return exportXml;
}

