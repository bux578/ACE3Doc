/// <reference path="./refs/node.d.ts"/>

import fs = require("fs");
import path = require("path");
import models = require("./models");
import parser = require("./parser");
import fsHelper = require("./fsHelper");
import htmlHelper = require("./htmlHelper");

var self = this;

export function parseFunctionFile(file: string): models.FunctionDoc {

    var data: string = fs.readFileSync(file, "utf8");

    if (!data || data === "") {
        return null;
    }

    var headerLines: Array<string> = parser.extractHeader(data);
    if (!headerLines || headerLines.length === 0) {
        return null;
    }

    var doc: models.FunctionDoc = new models.FunctionDoc(path.basename(file));

    doc.Path = file;
    doc = parser.parseHeader(headerLines, doc);

    return doc;
}

export function parseFunctionFiles(dir: string, callback: (err: NodeJS.ErrnoException, results: Array<models.FunctionDoc>) => void): void {

    var allFiles = fsHelper.walk(dir, [".sqf"], function(err, results) {
        if (err) {
            callback(err, null);
        }

        var allFunctions: Array<models.FunctionDoc> = [];

        results.forEach(function(file) {
            var doc: models.FunctionDoc = self.parseFunctionFile(file);
            if (doc) {
                allFunctions.push(doc);
            }
        });

        allFunctions = allFunctions.sort(function(a: models.FunctionDoc, b: models.FunctionDoc) {
            if (a.Path < b.Path) {
                return -1;
            }
            if (a.Path > b.Path) {
                return 1;
            }
            return 0;
        });

        callback(null, allFunctions);
    })

}

export function createFunctionDocumentationFile(dir: string, type: string, outputFile: string) {
    self.parseFunctionFiles(dir, function(err, allFunctions) {
        if (type === "html") {
            htmlHelper.saveDocsToHtmlFile(allFunctions, dir, outputFile)
        }
    });
}
