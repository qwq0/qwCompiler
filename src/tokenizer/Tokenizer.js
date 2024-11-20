import { TokenizeResult } from "./TokenizeResult";

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
    ",",
    ";"
]);

let lowercaseLetterSet = new Set(
    (new Array(26)).fill(0).map((_o, i) => String.fromCharCode("a".charCodeAt(0) + i))
);
let uppercaseLetterSet = new Set(
    (new Array(26)).fill(0).map((_o, i) => String.fromCharCode("A".charCodeAt(0) + i))
);
let numberSet = new Set(
    (new Array(10)).fill(0).map((_o, i) => String.fromCharCode("0".charCodeAt(0) + i))
);



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
            { }
            else if (numberSet.has(nowChar))
            {
            }
            else if (nowChar == " " || nowChar == "\t")
            { }
        }

        return ret;
    }
}