/// <reference path="./refs/node.d.ts"/>
"use strict";
var fs = require("fs");
var path = require("path");
function extractModule(file) {
    var pathObj = path.parse(file);
    if (pathObj && pathObj.dir && pathObj.dir.length > 0) {
        var arrPaths = pathObj.dir.split(path.sep);
        var addonsIndex = arrPaths.indexOf("addons");
        if (arrPaths.length - 1 >= addonsIndex + 1) {
            return arrPaths[addonsIndex + 1];
        }
        return null;
    }
}
exports.extractModule = extractModule;
function walk(dir, extensions, callback) {
    var results = [];
    fs.readdir(dir, function (err, list) {
        if (err) {
            return callback(err, null);
        }
        var pending = list.length;
        if (!pending) {
            return callback(null, results);
        }
        list.forEach(function (file) {
            file = path.resolve(dir, file);
            fs.stat(file, function (err, stat) {
                if (stat && stat.isDirectory()) {
                    walk(file, extensions, function (err, res) {
                        results = results.concat(res);
                        if (!--pending) {
                            callback(null, results);
                        }
                    });
                }
                else if (stat && stat.isFile()) {
                    if (!extensions) {
                        results.push(file);
                    }
                    if (extensions && extensions.length > 0) {
                        var hasExtension = false;
                        extensions.forEach(function (extension) {
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
}
exports.walk = walk;
