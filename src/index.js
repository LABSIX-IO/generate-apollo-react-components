"use strict";
exports.__esModule = true;
var fs = require("fs");
var path = require("path");
var ts_simple_ast_1 = require("ts-simple-ast");
var file = process.argv[process.argv.length - 2];
var file2 = process.argv[process.argv.length - 1];
if (!fs.existsSync(file)) {
    throw new Error('could not find file');
}
var project = new ts_simple_ast_1.Project({
    addFilesFromTsConfig: false
});
var source = project.addExistingSourceFile(file);
var interfaces = source
    .getInterfaces()
    .filter(function (itf) {
    var name = itf.getName();
    return (!name.includes('_') &&
        !name.endsWith('Variables') &&
        (name.startsWith('Q') || name.startsWith('M')));
})
    .map(function (i) { return i.getName(); });
fs.unlinkSync(file2);
var target = project.createSourceFile(file2);
var namedApolloImports = [];
var namedImports = interfaces;
interfaces.forEach(function (itf) {
    var type = itf.startsWith('M') ? 'Mutation' : 'Query';
    if (namedApolloImports.indexOf(type) === -1) {
        namedApolloImports.push(type);
    }
    var types = [itf];
    if (source.getInterface(itf + 'Variables')) {
        types.push(itf + 'Variables');
        namedImports.push(itf + 'Variables');
    }
    var typesString = "<" + types.join(', ') + ">";
    target.addClass({
        name: itf + type,
        "extends": type + typesString,
        isExported: true
    });
});
target.addImportDeclaration({
    moduleSpecifier: 'react-apollo',
    namedImports: namedApolloImports
});
target.addImportDeclaration({
    moduleSpecifier: path.relative(file2, file).replace(/\.ts$/, ''),
    namedImports: namedImports
});
target.saveSync();
console.log("Generated " + interfaces.length + " classes");
