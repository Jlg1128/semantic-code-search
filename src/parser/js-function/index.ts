import { ParseResult, Parser } from '../parserBase';
import {parse} from '@babel/parser'
import generate from '@babel/generator';
import traverse from '@babel/traverse';
import { isFunctionExpression, isArrowFunctionExpression, Comment, Identifier, identifier } from '@babel/types';

function comments2String(comments: Comment[] = []) {
  return comments.map(item => item.value).join('')
}

function genFunctionString(name: string, comment: string, body: string): string {
  return (comment ? `/**${comment}*/ ` : '') + body
}
function parseFunctions(source: string, filePath: string): ParseResult {
  const result: ParseResult = [];
  const ast = parse(source, {
    sourceType: 'module',
  });
  traverse(ast, {
    ObjectMethod(path) {
      const functionNode = path.node;
      const functionName = (functionNode.key as Identifier).name;
      const functionBody = generate(functionNode.body).code;
      const functionComment = comments2String(functionNode.leadingComments);
      const functionAll = 'function ' + generate(functionNode).code;
      result.push({functionName, code: functionAll, comment: functionComment, filePath});
    },
    ObjectProperty(path) {
      const node = path.node;
      if (isFunctionExpression(node.value)) {
        const functionNode = node.value;
        const functionBody = generate(functionNode.body).code;
        const functionName = (node.key as Identifier).name;
        if (!node.value.id) {
          node.value.id = identifier(functionName);
        }
        const functionAll = generate(functionNode).code;
        const functionComment = comments2String(path.node.leadingComments);
        result.push({functionName, code: functionAll, comment: functionComment, filePath});
      }
    },
    VariableDeclarator(path) {
      const node = path.node;
      if (isArrowFunctionExpression(node.init)) {
        const exp = node.init;
        const functionName = (node.id as Identifier).name;
        const functionBody = generate(exp.body).code;
        const functionComment = comments2String(path.parent.leadingComments);
        const functionAll = 'const ' + generate(node).code;
        result.push({functionName, code: functionAll, comment: functionComment, filePath});
      } else if (isFunctionExpression(node.init)) {
        const exp = node.init;
        const functionName = (node.id as Identifier).name;
        if (!exp.id) {
          exp.id = identifier(functionName);
        }
        const functionBody = generate(exp.body).code;
        const functionComment = comments2String(path.parent.leadingComments);
        const functionAll = generate(node.init).code;
        result.push({functionName, code: functionAll, comment: functionComment, filePath});
      }
    },
    FunctionDeclaration(path) {
      const node = path.node;
      const functionName = (node.id as Identifier).name;
      const functionBody = generate(node.body).code;
      const functionComment = comments2String(node.leadingComments);
      const functionAll = generate(node).code;
      result.push({functionName, code: functionAll, comment: functionComment, filePath});
    },
    ClassMethod(path) {
      const node = path.node;
      const functionName = (node.key as Identifier).name;
      const functionBody = generate(node.body).code;
      const functionComment = comments2String(node.leadingComments);
      delete node.leadingComments;
      delete node.trailingComments;
      const functionAll = 'function ' + generate(node).code;
      result.push({functionName, code: functionAll, comment: functionComment, filePath});
    }
  });
  return result;
}

const parser: Parser = (fileContent: string, filePath: string) => {
  return parseFunctions(fileContent, filePath);
}
export default parser;