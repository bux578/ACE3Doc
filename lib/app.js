/// <reference path="./refs/node.d.ts"/>
var fs = require("fs");
var path = require("path");
var models = require("./models");
var parser = require("./parser");
var fsHelper = require("./fsHelper");
var htmlHelper = require("./htmlHelper");
var self = this;
function parseFunctionFile(file) {
    var data = fs.readFileSync(file, "utf8");
    if (!data || data === "") {
        return null;
    }
    var headerLines = parser.extractHeader(data);
    if (!headerLines || headerLines.length === 0) {
        return null;
    }
    var doc = new models.FunctionDoc(path.basename(file));
    doc.Path = file;
    var module = fsHelper.extractModule(file);
    doc.Module = module.replace("-", " ").replace("_", " ");
    doc = parser.parseHeader(headerLines, doc);
    return doc;
}
exports.parseFunctionFile = parseFunctionFile;
function parseFunctionFiles(dir, callback) {
    var allFiles = fsHelper.walk(dir, [".sqf"], function (err, results) {
        if (err) {
            callback(err, null);
        }
        var allFunctions = [];
        results.forEach(function (file) {
            var doc = self.parseFunctionFile(file);
            if (doc) {
                allFunctions.push(doc);
            }
        });
        allFunctions = allFunctions.sort(function (a, b) {
            if (a.Path < b.Path) {
                return -1;
            }
            if (a.Path > b.Path) {
                return 1;
            }
            return 0;
        });
        callback(null, allFunctions);
    });
}
exports.parseFunctionFiles = parseFunctionFiles;
function createFunctionDocumentationFile(dir, type, outputFile) {
    self.parseFunctionFiles(dir, function (err, allFunctions) {
        if (type === "html") {
            htmlHelper.saveDocsToHtmlFile(allFunctions, dir, outputFile);
        }
    });
}
exports.createFunctionDocumentationFile = createFunctionDocumentationFile;
