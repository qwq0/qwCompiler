import { CompilerError } from "../error/CompilerError.js";
import { Token } from "../tokenizer/Token.js";
import { TokenizeResult } from "../tokenizer/TokenizeResult.js";
import { AstBlockNode } from "./nodes/AstBlockNode.js";
import { AstOperateNode } from "./nodes/AstOperateNode.js";
import { AstRootNode } from "./nodes/AstRootNode.js";

/**
 * 语句类型enum
 * @enum {number}
 */
let statementType = Object.freeze({
    never: -1,
    none: 0,
    functionDefine: 1,
    variableDefine: 2,
    expression: 3,
    ifStatement: 10,
    switchStatement: 11,
    forStatement: 12,
    whileStatement: 13,
    doWhileStatement: 14,
});

/**
 * ast构建器
 * 通过分词结果构建ast树
 */
export class AstBuilder
{
    /**
     * token列表
     * @type {Array<Token>}
     */
    tokens = null;
    /**
     * 当前处理到的token索引
     */
    tokenIndex = 0;
    /**
     * token索引栈
     * @type {Array<number>}
     */
    indexStack = [];
    /**
     * 代码块栈
     * @type {Array<AstBlockNode | AstRootNode>}
     */
    blockStack = [];
    /**
     * 表达式栈
     * @type {Array<AstOperateNode>}
     */
    expressionStack = [];
    /**
     * 当前在代码块中
     * 包括根节点
     */
    nowInBlock = true;
    /**
     * 构建完成
     */
    finished = false;


    /**
     * 当前正在处理的token
     * @returns {Token}
     */
    get nowToken()
    {
        return this.tokens[this.tokenIndex];
    }
    /**
     * 步进token
     * @param {number} step
     * @returns {Token}
     */
    stepToken(step = 1)
    {
        this.tokenIndex += step;
        if (this.tokenIndex > this.tokens.length)
            this.tokenIndex = this.tokens.length;
        else if (this.tokenIndex < 0)
            this.tokenIndex = 0;
        return this.tokens[this.tokenIndex];
    }
    /**
     * 获取下一个token
     * @param {number} step
     * @returns {Token}
     */
    peekToken(step)
    {
        return this.tokens[this.tokenIndex + step];
    }
    /**
     * 将当前token索引入栈
     */
    pushIndex()
    {
        this.indexStack.push(this.tokenIndex);
    }
    /**
     * 弹出栈中的状态并设置token索引
     */
    popIndex()
    {
        if (this.indexStack.length == 0)
            throw "cannot pop from empty stack";
        this.tokenIndex = this.indexStack.pop();
    }
    /**
     * 弹出索引栈顶并丢弃
     */
    discardIndex()
    {
        if (this.indexStack.length == 0)
            throw "cannot discard from empty stack";
        this.indexStack.pop();
    }


    /**
     * 表达式循环
     */
    expressionLoop()
    { }

    /**
     * 语句循环
     */
    statementLoop()
    {
        /**
         * @type {statementType}
         */
        let nowType = statementType.never;
        let defineType = "";

        if (this.nowToken?.type == "keyword")
        { // 关键字
            if (this.nowToken.keywordInfo.isValueType)
            { // 基础类型
                defineType = this.nowToken.value;

                if (this.peekToken(2)?.is({ type: "punc", value: "(" }))
                { // 定义函数
                    // 0   1 2
                    // int a ( ) { ... }
                    nowType = statementType.functionDefine;
                }
                else
                { // 定义变量
                    // 0   1 2
                    // int a ;
                    nowType = statementType.variableDefine;
                }
            }
            else if (this.nowToken.keywordInfo.isControl)
            { // 控制语句
                switch (this.nowToken.keywordInfo.name)
                {
                    case "if":
                        nowType = statementType.ifStatement;
                        break;
                    case "switch":
                        nowType = statementType.switchStatement;
                        break;
                    case "for":
                        nowType = statementType.forStatement;
                        break;
                    case "while":
                        nowType = statementType.whileStatement;
                        break;
                    case "do":
                        nowType = statementType.doWhileStatement;
                        break;
                }
            }
            else
            { // 表达式
                nowType = statementType.expression;
            }
        }
        else
        { // 表达式
            nowType = statementType.expression;
        }

        switch (nowType)
        {
            case statementType.never:
                throw CompilerError.create("A unknown statement has appeared", this.nowToken?.startIndex);
            default:
                throw CompilerError.create("unprocessed statement type", this.nowToken?.startIndex);
        }
    }

    /**
     * 状态机主循环
     */
    mainLoop()
    {
        if (this.nowInBlock)
            this.statementLoop();
        else
            this.expressionLoop();
    }

    /**
     * 构建
     */
    build()
    {
        while (!this.finished)
        {
            this.mainLoop();
        }
    }

    /**
     * 设置用于构建的token
     * @param {TokenizeResult} tokenizeResult 
     */
    setTokens(tokenizeResult)
    {
        this.tokens = tokenizeResult.list.filter(o => o.type != "annotation");
        this.tokenIndex = 0;
    }
}