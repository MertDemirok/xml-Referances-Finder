var unzip = require('unzip');
var fs = require('fs');

module.exports.ExtractFileFromArchive = function ExtractFileFromArchive (path) {

 
var inputFileName = "../XmlReferanceFinder/ImportXML/sbconfig_Resources.zip";
var fileToExtract = "../ImportXML";
var extractToDirectory = "../ImportXML/APP";


fs.createReadStream(inputFileName)
	.pipe(unzip.Parse())
	.on('entry', function (entry) {

		if (entry.path === fileToExtract) {
			console.log('Extracting file ' + fileToExtract);

			var fileName = fileToExtract.replace(/^.*[/]/, '');
			entry.pipe(fs.createWriteStream(extractToDirectory + fileName));
		} else {
			entry.autodrain();
		}
	});

}
