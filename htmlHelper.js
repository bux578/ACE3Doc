"use strict";
var fs = require("fs");
function saveDocsToHtmlFile(docs, dir, outputFile) {
    var html = "";
    var allModules = [];
    docs.forEach(function (item, index) {
        var output = "";
        if (allModules.indexOf(item.Module) === -1) {
            allModules.push(item.Module);
            if (index !== 1) {
                output += "</section>";
            }
            output += "<section id=\"" + escapeHtml(item.Module).replace(" ", "") + "\">";
            output += "<h2>" + escapeHtml(item.Module) + "</h2>\n";
        }
        var url = item.Path.replace(dir, "https://github.com/acemod/ACE3/tree/master/addons").replace("\\", "/");
        output += "<article>";
        output += "<h3 id=\"" + escapeHtml(item.Name).replace(" ", "") + "\"><a href=\"" + url + "\">" + escapeHtml(item.Name) + "</a></h3>\n";
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
        output += "</article>";
        output += "\n";
        html += output;
    });
    var moduleToc = "<div><ul>";
    allModules.forEach(function (item) {
        var moduleOutput = "<li>";
        moduleOutput += '<a href="#' + escapeHtml(item).replace(" ", "") + '">';
        moduleOutput += item;
        moduleOutput += "</a>";
        moduleOutput += "</li>";
        moduleToc += moduleOutput;
    });
    moduleToc += "</ul></div>";
    html = moduleToc + html;
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
