const FXparser = require('fast-xml-parser');
var fileRead = require('./readFile')
var writeFile = require('./writeFile')
var he = require('he');
var index = require('./index');

module.exports.runProcess = function runProcess(){

    var options = {
        attributeNamePrefix : "",
        attrNodeName: "attr", //default is 'false'
        textNodeName : "#text",
        ignoreAttributes : false,
        ignoreNameSpace : false,
        allowBooleanAttributes : false,
        parseNodeValue : true,
        parseAttributeValue : false,
        trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\\c",
        localeRange: "", //To support non english character in tag/attribute values.
        parseTrueNumberOnly: false,
        attrValueProcessor: a => he.decode(a, {isAttributeValue: true}),//default is a=>a
        tagValueProcessor : a => he.decode(a) //default is a=>a
    }
    
    fileRead.readFileXml().then( content => {
    
      
        if( FXparser.validate(content) === true) {
            
             var jsonObj = FXparser.parse(content,options);
        
             var items = jsonObj['xml-fragment']['imp:exportedItemInfo'];
             //console.log(items)
             writeFile.writeFiletoXlsx(items);
    
        }
    });

}


//for test function
//index.runProcess();






