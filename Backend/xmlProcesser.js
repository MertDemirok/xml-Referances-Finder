const FXparser = require('fast-xml-parser');
var he = require('he');
var writeFile = require('./writeControl');


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

    if (!eO.repateStatus) {
        var result = writeFile.writeFile(exportData, eO);
        return result;
    } else {
        return exportData;
    }

}

function getExportInfoData(cont, opt, excelOptions) {


    if (FXparser.validate(cont) === true) {

        var jsonObj = FXparser.parse(cont, opt);

        var serviceType = excelOptions.serviceType;
        if (!excelOptions.repateStatus) {
            var resultObject = xmlToJsonParsingForDefault(jsonObj, serviceType);
            return resultObject;
        } else {
            var resultObject = xmlToJsonParsingForEndPoint(jsonObj);
            return resultObject;
        }
    }
}

function xmlToJsonParsingForEndPoint(params) {

    var items = params['xml-fragment']['ser:endpointConfig']['tran:URI'];
    var endPoint = "";

    if (items === undefined) {
        endPoint = "Not Found EndPoint :(";
    } else {
        if (items['env:value']['#text'] !== undefined) {

            endPoint = items['env:value']['#text'];

        } else {
            endPoint = items['env:value'];

        }
    }

    return endPoint;
}

function xmlToJsonParsingForDefault(params, type) {

    var items = params['xml-fragment']['imp:exportedItemInfo'];

    var xmlDataObj = [];
    var counter = 0;

    items.forEach(function (item) {
        if (item.attr.typeId === type) {

            var props = item['imp:properties']['imp:property'];
            var counter_p = 0;

            var xmlInfoData = { path: "", referances: [], resourceType: [], psCount: 0, bsCount: 0 }

            xmlInfoData.path = item.attr.instanceId;

            props.forEach(function (prop) {

                if (prop.attr.name === "extrefs") {

                    var refData = prop.attr.value.toString();

                    xmlInfoData.referances[counter_p] = refData.slice(refData.lastIndexOf('OSB_Applications', '$')).replace(/\$/g, '/');
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




