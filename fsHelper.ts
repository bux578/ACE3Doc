/// <reference path="./refs/node.d.ts"/>

"use strict";

import fs = require("fs");
import path = require("path");

// extract the module from the file path
// module is always the next dir after the "addons" dir
export function extractModule (file: string): string {
    //https://nodejs.org/api/path.html#path_path_parse_pathstring
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

// Walks in parallel and recursivly through a directory tree
// returns a list of files that can be filtered by extension
export function walk(dir: string, extensions: Array<string>, callback: (err: NodeJS.ErrnoException, results: Array<string>) => void) {
    var results: Array<string> = [];

    fs.readdir(dir, function(err, list) {
        if (err) {
            return callback(err, null);
        }

        var pending: number = list.length;
        if (!pending) {
            return callback(null, results);
        }

        list.forEach(function(file: string) {
            file = path.resolve(dir, file);
            fs.stat(file, function(err: NodeJS.ErrnoException, stat: fs.Stats) {
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
}
