"use strict";
export class FunctionDoc {

    private name: string;
    private path: string;
    private description: string;
    private author: string;
    private args: Array<string> = [];
    private returns: Array<string> = [];
    private example: string;
    private isPublic: boolean;

    constructor(functionName: string) {
        this.name = functionName;
    }

    get Name(): string {
        return this.name;
    }
    set Name(value: string) {
        this.name = value;
    }
    get Path(): string {
        return this.path;
    }
    set Path(value: string) {
        this.path = value;
    }
    get Description(): string {
        return this.description;
    }
    set Description(value: string) {
        this.description = value;
    }
    get Author(): string {
        return this.author;
    }
    set Author(value: string) {
        this.author = value;
    }
    get Args(): Array<string> {
        return this.args;
    }
    set Args(value: Array<string>) {
        this.args = value;
    }
    get Returns(): Array<string> {
        return this.returns;
    }
    set Returns(value: Array<string>) {
        this.returns = value;
    }
    get Example(): string {
        return this.example;
    }
    set Example(value: string) {
        this.example = value;
    }
    get IsPublic(): boolean {
        return this.isPublic;
    }
    set IsPublic(value: boolean) {
        this.isPublic = value;
    }
}
