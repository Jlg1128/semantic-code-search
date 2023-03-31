import { ParseResult, Parser } from '../parserBase';
import {parse} from '@babel/parser'
import generate from '@babel/generator';
import traverse from '@babel/traverse';
import { isFunctionExpression, isArrowFunctionExpression, Comment, identifier } from '@babel/types';
import * as t from '@babel/types';

function comments2String(comments: Comment[] = []) {
  return comments.map(item => item.value).join('')
}

function getFunctionString(source: string, node: t.ObjectMethod | t.FunctionExpression | t.VariableDeclarator | t.FunctionDeclaration | t.ClassMethod) {
  return source.slice(node.start, node.end);
}

function getFunctionName(key: any) {
  if (t.isStringLiteral(key)) {
    return key.value;
  } else if (t.isIdentifier(key)) {
    return key.name
  }
  return '';
}
function parseFunctions(source: string, filePath: string): ParseResult {
  const result: ParseResult = [];
  const ast = parse(source, {
    sourceType: 'module',
    strictMode: false,
    plugins: ['jsx', 'typescript']
  });
  traverse(ast, {
    ObjectMethod(path) {
      const functionNode = path.node;
      const functionName = getFunctionName(functionNode.key);
      const functionComment = comments2String(functionNode.leadingComments);
      result.push({functionName, code: getFunctionString(source, functionNode), comment: functionComment, filePath});
    },
    ObjectProperty(path) {
      const node = path.node;
      if (isFunctionExpression(node.value)) {
        const functionNode = node.value;
        const functionName = getFunctionName(node.key)
        if (!node.value.id) {
          node.value.id = identifier(functionName);
        }
        const functionComment = comments2String(path.node.leadingComments);
        result.push({functionName, code: getFunctionString(source, functionNode), comment: functionComment, filePath});
      }
    },
    VariableDeclarator(path) {
      const node = path.node;
      if (isArrowFunctionExpression(node.init)) {
        const exp = node.init;
        const functionName = getFunctionName(node.id);
        const functionComment = comments2String(path.parent.leadingComments);
        result.push({functionName, code: getFunctionString(source, node), comment: functionComment, filePath});
      } else if (isFunctionExpression(node.init)) {
        const exp = node.init;
        const functionName = getFunctionName(node.id);
        if (!exp.id) {
          exp.id = identifier(functionName);
        }
        const functionComment = comments2String(path.parent.leadingComments);
        result.push({functionName, code: getFunctionString(source, node.init), comment: functionComment, filePath});
      }
    },
    FunctionDeclaration(path) {
      const node = path.node;
      const functionName = getFunctionName(node.id);
      const functionComment = comments2String(node.leadingComments);
      result.push({functionName, code: getFunctionString(source, node), comment: functionComment, filePath});
    },
    ClassMethod(path) {
      const node = path.node;
      const functionName = getFunctionName(node.key);
      const functionComment = comments2String(node.leadingComments);
      delete node.leadingComments;
      delete node.trailingComments;
      result.push({functionName, code: getFunctionString(source, node), comment: functionComment, filePath});
    }
  });
  return result;
}

const parser: Parser = (fileContent: string, filePath: string) => {
  return parseFunctions(fileContent, filePath);
}
export default parser;