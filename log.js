const fs = require('fs');


module.exports.loging = async (logText,error) => {
  // write to a new file named 2pac.txt
fs.writeFile('.//logFile/Log.txt', logText, (err) => {  
    // throws an error, you could also catch it here
    if (err) throw err;
});
   
}


