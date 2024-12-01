import { CompilerError } from "../error/CompilerError.js";
import { Token } from "./Token.js";
import { TokenizeResult } from "./TokenizeResult.js";

/**
 * 关键字集合
 * @type {Set<string>}
 */
let keywordsSet = new Set([
    "const",
    "void",
    "int",
    "uint",
    "int8",
    "int16",
    "int32",
    "int64",
    "uint8",
    "uint16",
    "uint32",
    "uint64",
    "int128",
    "float",
    "float32",
    "float64",
    "string",
    "bool",
    "true",
    "false",
    "tuple",
    "class",
    "template",
    "this",
    "if",
    "else",
    "switch",
    "case",
    "while",
    "do",
    "for",
    "continue",
    "break",
    "async",
    "await",
    "return",
    "goto",
    "try",
    "catch",
    "throw",
    "import",
    "export"
]);

let puncSet = new Set([
    "(",
    ")",
    "[",
    "]",
    "{",
    "}",
    ",",
    ";"
]);

// 小写字母字符集合
let lowercaseLetterSet = new Set(
    (new Array(26)).fill(0).map((_o, i) => String.fromCharCode("a".charCodeAt(0) + i))
);
// 大写字母字符集合
let uppercaseLetterSet = new Set(
    (new Array(26)).fill(0).map((_o, i) => String.fromCharCode("A".charCodeAt(0) + i))
);
// 数字字符集合
let numberSet = new Set(
    (new Array(10)).fill(0).map((_o, i) => String.fromCharCode("0".charCodeAt(0) + i))
);
// 标识符符号字符集合
let identifierCharSet = new Set([
    "_",
    "$"
]);
// 引号字符列表
let quotationSet = new Set([
    "\"",
    "\'",
    "\`"
]);



/**
 * 分词器类
 */
export class Tokenizer
{
    /**
     * 分词
     * @param {string} srcCode
     * @returns {TokenizeResult}
     */
    tokenize(srcCode)
    {
        let ret = new TokenizeResult();

        let nowTokenStart = 0;
        let nowIndex = 0;

        while (nowIndex < srcCode.length)
        {
            let nowChar = srcCode[nowIndex];
            if (lowercaseLetterSet.has(nowChar) || uppercaseLetterSet.has(nowChar))
            { // 标识符和关键字
                nowTokenStart = nowIndex;
                do                
                {
                    nowChar = srcCode[++nowIndex];
                }
                while (
                    lowercaseLetterSet.has(nowChar) ||
                    uppercaseLetterSet.has(nowChar) ||
                    numberSet.has(nowChar) ||
                    identifierCharSet.has(nowChar)
                );
                let part = srcCode.slice(nowTokenStart, nowIndex);

                let token = new Token();
                token.type = (keywordsSet.has(part) ? "keyword" : "identifier");
                token.startIndex = nowTokenStart;
                token.endIndex = nowIndex;
                token.value = part;
                token.orgValue = part;
                ret.list.push(token);
            }
            else if (numberSet.has(nowChar))
            { // 数字
                nowTokenStart = nowIndex;
                do
                {
                    nowChar = srcCode[++nowIndex];
                }
                while (
                    lowercaseLetterSet.has(nowChar) ||
                    uppercaseLetterSet.has(nowChar) ||
                    numberSet.has(nowChar) ||
                    identifierCharSet.has(nowChar)
                );
                let part = srcCode.slice(nowTokenStart, nowIndex);

                let token = new Token();
                token.startIndex = nowTokenStart;
                token.endIndex = nowIndex;
                token.type = "number";
                token.value = part;
                token.orgValue = part;
                ret.list.push(token);
            }
            else if (nowChar == " " || nowChar == "\t" || nowChar == "\n" || nowChar == "\r")
            { // 空白分隔
                do
                {
                    nowChar = srcCode[++nowIndex];
                }
                while (
                    nowChar == " " ||
                    nowChar == "\t" ||
                    nowChar == "\n" ||
                    nowChar == "\r"
                );
            }
            else if (puncSet.has(nowChar))
            { // 标点符号和括号符号
                nowTokenStart = nowIndex;
                nowIndex++;
                let part = srcCode.slice(nowTokenStart, nowIndex);

                let token = new Token();
                token.startIndex = nowTokenStart;
                token.endIndex = nowIndex;
                token.type = "punc";
                token.value = part;
                token.orgValue = part;
                ret.list.push(token);
            }
            else if (quotationSet.has(nowChar))
            { // 引号
                let startQuotationChar = nowChar;
                nowTokenStart = nowIndex;
                do                
                {
                    nowChar = srcCode[++nowIndex];
                    if (nowIndex >= srcCode.length)
                        throw CompilerError.create("Quotation with no end", nowTokenStart);
                }
                while (
                    nowChar != startQuotationChar
                );
                nowIndex++;
                let part = srcCode.slice(nowTokenStart, nowIndex);

                let token = new Token();
                token.startIndex = nowTokenStart;
                token.endIndex = nowIndex;
                token.type = "literalString";
                token.value = part;
                token.orgValue = part;
                ret.list.push(token);
            }
            else
            { // 意外字符
                throw CompilerError.create("An unexpected character has appeared", nowIndex);
            }
        }

        return ret;
    }
}