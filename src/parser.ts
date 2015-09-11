"use strict";
import models = require("./models");

// Extract function headers
// lines in the header should be prefixed with " * "
// removes empty lines that only contains above prefix
export function extractHeader(fileContent: string) {
    var re = /(^\s*\*[^\/\n].*)/gm;

    var matches = fileContent.match(re);
    if (matches) {
        var cleaned: Array<string> = [];
        matches.forEach(function(item) {
            var value = item.replace(/^\s*\*\s*/, "");
            if (value != "") {
                cleaned.push(value);
            }
        });
        return cleaned;
    }
    return null;
}

// parses an ace3 function header
// due to the fact that the length of the array is unknown the code is a little bit hacky and probably not very stable
export function parseHeader(headerLines: Array<string>, doc: models.FunctionDoc): models.FunctionDoc {

    var authorIndex, descriptionIndex, argsStartIndex, returnStartIndex, exampleStartIndex, publicIndex;

    headerLines.forEach(function(item, index) {

        if (item.indexOf("Author: ") === 0) {
            authorIndex = index;
            doc.Author = item.replace("Author: ", "");
            return;
        }

        if (authorIndex >= 0 && !descriptionIndex) {
            descriptionIndex = index;
            doc.Description = item;
            return;
        }

        if (authorIndex >= 0 && descriptionIndex >= 0) {
            if (!argsStartIndex) {
                argsStartIndex = index;
                return;
            }

            if (argsStartIndex < index && !returnStartIndex && item.indexOf("Return Value:") === -1) {
                doc.Args.push(item.replace(/(^\d+: )/, ""));
                return;
            }

            if (item.indexOf("Return Value:") === 0) {
                returnStartIndex = index;
                return;
            }

            if (returnStartIndex < index && !exampleStartIndex && item.indexOf("Example:") === -1) {
                doc.Returns.push(item.replace(/(^\d+: )/, ""));
                return;
            }

            if (item.indexOf("Example:") === 0) {
                exampleStartIndex = index;
                return;
            }

            if (exampleStartIndex < index && !publicIndex && item.indexOf("Public:") === -1) {
                doc.Example = item;
                return;
            }

            if (item.indexOf("Public:") === 0) {
                publicIndex = index;
                var isPublic: string = item.replace("Public: ", "");
                if (isPublic.toLowerCase() === "yes") {
                    doc.IsPublic = true;
                } else {
                    doc.IsPublic = false;
                }
            }

        }

    });

    return doc;
}
