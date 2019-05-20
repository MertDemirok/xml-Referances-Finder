const FXparser = require('fast-xml-parser');
var he = require('he');
var writeFile = require('./writeControl');
const dirTree = require("directory-tree");

var projectPaths = []
var status = 0;
module.exports.xmlTransform = function xmlTransform(content, eO) {

    var options = {
        attributeNamePrefix: "",
        attrNodeName: "attr", //default is 'false'
        textNodeName: "#text",
        ignoreAttributes: false,
        ignoreNameSpace: false,
        allowBooleanAttributes: false,
        parseNodeValue: true,
        parseAttributeValue: false,
        trimValues: true,
        cdataTagName: "__cdata", //default is 'false'
        cdataPositionChar: "\\c",
        localeRange: "", //To support non english character in tag/attribute values.
        parseTrueNumberOnly: false,
        attrValueProcessor: a => he.decode(a, { isAttributeValue: true }),//default is a=>a
        tagValueProcessor: a => he.decode(a) //default is a=>a
    }

    var exportData = getExportInfoData(content, options, eO);

    if (eO.oparation == "compareProject") {
        getFolderTree(eO.localProjectPath);
        var result = writeFile.writeFile(projectPaths, eO);

        projectPaths.forEach(element => {
            var projectPath = element.substring(eO.localProjectPath.length + 1);

            if(status == 1)
            console.log("Path-->" , projectPath);

            exportData.forEach(edata => {
                var exportXml = edata.resourceType[0].replace(/\//g, '\\');

                if (projectPath === exportXml) {
                    status = 1;
                    return;
                }
               
                status = 0;
            });

          

        });

        return "";
    } else {

        if (!eO.repateStatus) {
            var result = writeFile.writeFile(exportData, eO);
            return result;
        } else {
            return exportData;
        }

    }

}



function getExportInfoData(cont, opt, excelOptions) {


    if (FXparser.validate(cont) === true) {

        var jsonObj = FXparser.parse(cont, opt);

        const serviceType = excelOptions.serviceType;
        const operation = excelOptions.oparation;

        if (!excelOptions.repateStatus) {
            var resultObject = xmlToJsonParsingForDefault(jsonObj, serviceType, operation);
            return resultObject;
        } else {
            var resultObject = xmlToJsonParsingForEndPoint(jsonObj,excelOptions);
            return resultObject;
        }
    }
}

function xmlToJsonParsingForEndPoint(params,opt) {

    var items = ""
   
    if(opt.oracleVersion == "12c"){
        if(opt.serviceType === "ProxyService"){
            items = params['ser:proxyServiceEntry']['ser:endpointConfig']['tran:URI']
        }else if(opt.serviceType === "BusinessService"){
            items = params['con:businessServiceEntry']['con:endpointConfig']['tran:URI']
        }
    }else if( opt.oracleVersion=="11g"){
     items = params['xml-fragment']['ser:endpointConfig']['tran:URI'];
    }
        
    var endPoint = "";
    if (items === undefined || items['env:value'] === undefined) {
        endPoint = "Not Found EndPoint";
    } else {
        if (items['env:value']['#text'] !== undefined) {
            endPoint = items['env:value']['#text'];
        } else {
            endPoint = items['env:value'];
        }
    }


    return endPoint;
}

function xmlToJsonParsingForDefault(params, type, opr) {

    var items = params['xml-fragment']['imp:exportedItemInfo'];

    var xmlDataObj = [];
    var counter = 0;

    items.forEach(function (item) {

        if (item.attr.typeId === type || type === "") {

            var props = item['imp:properties']['imp:property'];
            var counter_p = 0;

            var xmlInfoData = { path: "", typeId: "", referances: [], resourceType: [], psCount: 0, bsCount: 0 }

            xmlInfoData.path = item.attr.instanceId;
            xmlInfoData.typeId = item.attr.typeId;

            props.forEach(function (prop) {

                var attrType = "extrefs";

                if (opr == "compareProject") {
                    attrType = "jarentryname";
                }

                if (prop.attr.name === attrType) {

                    var refData = prop.attr.value.toString();
                    // console.log("Referances ---->",refData);


                    xmlInfoData.referances[counter_p] = refData.slice(refData.split('$')[0].length + 1).replace(/\$/g, '/');
                    // console.log("fix ---->",xmlInfoData.referances[counter_p]);
                    // xmlInfoData.referances[counter_p] = refData.slice(refData.lastIndexOf('OSB_Applications', '$')).replace(/\$/g, '/');
                    xmlInfoData.resourceType[counter_p] = refData.split('$')[0];



                    if (xmlInfoData.resourceType[counter_p] === "BusinessService") {
                        xmlInfoData.bsCount += 1;
                    } else if (xmlInfoData.resourceType[counter_p] === "ProxyService") {
                        xmlInfoData.psCount += 1;
                    }

                    counter_p += 1;
                }
            });

            xmlDataObj[counter] = xmlInfoData;
            counter += 1;
        }
    });

    return xmlDataObj;
}


function getFolderTree(localpath) {


    var strollingPath = dirTree(localpath);

    if (strollingPath) {

        var child = strollingPath.children;

        child.forEach(element => {
            filetypeControl(element);
        });

    }

}


function filetypeControl(obj) {

    if (obj.type == 'directory') {

        obj.children.forEach(ch => {

            if (ch.type == 'file') {

                projectPaths.push(ch.path);

            } else {
                filetypeControl(ch);
            }

        });
    }
}
