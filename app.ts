/// <reference path="./refs/node.d.ts"/>

"use strict";

import fs = require("fs");
import path = require("path");
import models = require('./models');

// Walks in parallel and recursivly through a directory tree
// returns a list of files that can be filtered by extension
var walk = function(dir, extensions: Array<string>, callback) {
    var results = [];
    fs.readdir(dir, function(err, list) {
        if (err) {
            return callback(err, null);
        }

        var pending: number = list.length;
        if (!pending) {
            return callback(null, results);
        }

        list.forEach(function(file) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err, stat: fs.Stats) {
                if (stat && stat.isDirectory()) {
                    walk(file, extensions, function(err, res) {
                        results = results.concat(res);
                        if (!--pending) {
                            callback(null, results);
                        }
                    });
                } else if (stat && stat.isFile()) {
                    if (!extensions) {
                        results.push(file);
                    }
                    if (extensions && extensions.length > 0) {
                        var hasExtension = false;
                        extensions.forEach(function(extension) {
                            if (file.toLowerCase().indexOf(extension, file.length - 6) > -1) {
                                hasExtension = true;
                            }
                        });
                        if (hasExtension) {
                            results.push(file);
                        }
                    }
                    if (!--pending) {
                        callback(null, results);
                    }
                }
            });
        });
    });
};

// Extract function headers
// lines in the header should be prefixed with " * "
// removes empty lines that only contains above prefix
var extractHeader = function(fileContent: string) {
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
var parseHeader = function(headerLines: Array<string>, doc: models.FunctionDoc): models.FunctionDoc {

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
};

// loops through the passed FunctionDoc Array and creates html output
// saves those to a file "doc.html" next to the app file
var saveDocsToHtmlFile = function (docs: Array<models.FunctionDoc>) {
    var html = "";

    docs.forEach(function(item: models.FunctionDoc) {
        var output = "";

        var url = item.Path.replace(addonsPath, "https://github.com/acemod/ACE3/tree/master/addons").replace("\\", "/");

        output += "<div>";
        output += "<h2 id=\"" + escapeHtml(item.Name) + "\"><a href=\"" + url + "\">" + escapeHtml(item.Name) + "</a></h2>\n";
        output += "<small>" + escapeHtml(item.Path) + "</small>\n";
        output += "<p><em>" + escapeHtml(item.Description) + "</em></p>" + "\n";
        output += "<p><b>Author:</b> " + escapeHtml(item.Author) + "</p>" + "\n";
        if (item.Args.length > 0) {
            output += "<p><b>Arguments:</b>\n<ol>" + "\n";
            item.Args.forEach(function(arg) {
                output += "\t<li>" + escapeHtml(arg) + "</li>" + "\n";
            });
            output += "</ol></p>" + "\n";
        }
        if (item.Returns.length > 0) {
            output += "<p><b>Returns:</b>\n<ol>" + "\n";
            item.Returns.forEach(function(ret) {
                output += "\t<li>" + escapeHtml(ret) + "</li>" + "\n";
            });
            output += "</ol></p>" + "\n";
        }
        if (item.Example) {
            output += "<pre><code>" + escapeHtml(item.Example) + "</code></pre>" + "\n";
        }
        if (item.IsPublic === true || item.IsPublic === false) {
            output += "<p><b>Public:</b> " + item.IsPublic + "</p>" + "\n";
        }
        output += "</div>";
        html += output;
        html += "\n<hr/>\n";
    });

    fs.writeFile("./doc.html", html, function(err, file) {
        if (err) {
            throw err;
        }

        console.log("The file was saved!");
    });
}

// small function to escape html entities
var escapeHtml = function(text) {

    if (!text) {
        return text;
    }

    function replaceTag(tag) {
        return tagsToReplace[tag] || tag;
    }

    var tagsToReplace = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
    };
    return text.replace(/[&<>]/g, replaceTag);
}


// execute
var addonsPath = "C:\\Dev\\github\\ACE3\\addons";

walk(addonsPath, [".sqf"], function(err, results) {
    if (err) {
        throw err;
    }

    var docs: Array<models.FunctionDoc> = [];

    results.forEach(function(file) {

        var doc: models.FunctionDoc;

        var data = fs.readFileSync(file, "utf8");

        if (!data || data === "") {
            return;
        }

        var headerLines = extractHeader(data);
        if (!headerLines || headerLines.length === 0) {
            return;
        }
        if (headerLines) {
            doc = new models.FunctionDoc(path.basename(file));
            doc.Path = file;
            doc = parseHeader(headerLines, doc);
        }

        if (doc) {
            docs.push(doc);
        }
    });

    docs = docs.sort(function(a: models.FunctionDoc, b: models.FunctionDoc) {
        if (a.Path < b.Path) {
            return -1;
        }
        if (a.Path > b.Path) {
            return 1;
        }
        return 0;
    });

    saveDocsToHtmlFile(docs);

});
