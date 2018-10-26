import * as fs from 'fs';
import * as path from 'path';
import {
  Project,
  NameableNode,
  InterfaceDeclaration,
  TypeAssertion
} from 'ts-simple-ast';

const file = process.argv[process.argv.length - 2];
const file2 = process.argv[process.argv.length - 1];

if (!fs.existsSync(file)) {
  throw new Error('could not find file');
}

const project = new Project({
  addFilesFromTsConfig: false
});

const source = project.addExistingSourceFile(file);

const interfaces = source
  .getInterfaces()
  .filter(itf => {
    const name = itf.getName();
    return (
      !name.includes('_') &&
      !name.endsWith('Variables') &&
      (name.startsWith('Q') || name.startsWith('M'))
    );
  })
  .map(i => i.getName());

fs.unlinkSync(file2);
const target = project.createSourceFile(file2);

const namedApolloImports: string[] = [];
const namedImports = interfaces;

interfaces.forEach(itf => {
  const type = itf.startsWith('M') ? 'Mutation' : 'Query';
  if (namedApolloImports.indexOf(type) === -1) {
    namedApolloImports.push(type);
  }
  const types = [itf];
  if (source.getInterface(itf + 'Variables')) {
    types.push(itf + 'Variables');
    namedImports.push(itf + 'Variables');
  }
  const typesString = `<${types.join(', ')}>`;
  target.addClass({
    name: itf + type,
    extends: type + typesString,
    isExported: true
  });
});

target.addImportDeclaration({
  moduleSpecifier: 'react-apollo',
  namedImports: namedApolloImports
});
target.addImportDeclaration({
  moduleSpecifier: path.relative(file2, file).replace(/\.ts$/, ''),
  namedImports
});

target.saveSync();

console.log(`Generated ${interfaces.length} classes`);
