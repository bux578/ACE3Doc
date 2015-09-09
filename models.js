"use strict";
var FunctionDoc = (function () {
    function FunctionDoc(functionName) {
        this.args = [];
        this.returns = [];
        this.name = functionName;
    }
    Object.defineProperty(FunctionDoc.prototype, "Name", {
        get: function () {
            return this.name;
        },
        set: function (value) {
            this.name = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunctionDoc.prototype, "Path", {
        get: function () {
            return this.path;
        },
        set: function (value) {
            this.path = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunctionDoc.prototype, "Description", {
        get: function () {
            return this.description;
        },
        set: function (value) {
            this.description = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunctionDoc.prototype, "Author", {
        get: function () {
            return this.author;
        },
        set: function (value) {
            this.author = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunctionDoc.prototype, "Args", {
        get: function () {
            return this.args;
        },
        set: function (value) {
            this.args = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunctionDoc.prototype, "Returns", {
        get: function () {
            return this.returns;
        },
        set: function (value) {
            this.returns = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunctionDoc.prototype, "Example", {
        get: function () {
            return this.example;
        },
        set: function (value) {
            this.example = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(FunctionDoc.prototype, "IsPublic", {
        get: function () {
            return this.isPublic;
        },
        set: function (value) {
            this.isPublic = value;
        },
        enumerable: true,
        configurable: true
    });
    return FunctionDoc;
})();
exports.FunctionDoc = FunctionDoc;
