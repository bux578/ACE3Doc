"use strict";
var fs = require("fs");
function saveDocsToHtmlFile(docs, dir, outputFile) {
    var html = "";
    docs.forEach(function (item) {
        var output = "";
        var url = item.Path.replace(dir, "https://github.com/acemod/ACE3/tree/master/addons").replace("\\", "/");
        output += "<div>";
        output += "<h2 id=\"" + escapeHtml(item.Name) + "\"><a href=\"" + url + "\">" + escapeHtml(item.Name) + "</a></h2>\n";
        output += "<small>" + escapeHtml(item.Path) + "</small>\n";
        output += "<p><em>" + escapeHtml(item.Description) + "</em></p>" + "\n";
        output += "<p><b>Author:</b> " + escapeHtml(item.Author) + "</p>" + "\n";
        if (item.Args.length > 0) {
            output += "<p><b>Arguments:</b>\n<ol>" + "\n";
            item.Args.forEach(function (arg) {
                output += "\t<li>" + escapeHtml(arg) + "</li>" + "\n";
            });
            output += "</ol></p>" + "\n";
        }
        if (item.Returns.length > 0) {
            output += "<p><b>Returns:</b>\n<ol>" + "\n";
            item.Returns.forEach(function (ret) {
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
    fs.writeFile(outputFile, html, function (err, file) {
        if (err) {
            throw err;
        }
        console.log("The file was saved!");
    });
}
exports.saveDocsToHtmlFile = saveDocsToHtmlFile;
var escapeHtml = function (text) {
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
};
