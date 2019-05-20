const fs = require('fs');


module.exports.loging = async (logText,error) => {
  

fs.appendFile('../XmlReferanceFinder/Backend/logFile/Log.txt', logText, (err) => {  
    // throws an error, you could also catch it here
    if (err) throw err;
});
   
}


