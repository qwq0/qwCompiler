import { Token } from "../tokenizer/Token.js";
import { TokenizeResult } from "../tokenizer/TokenizeResult.js";
import { AstBlockNode } from "./nodes/AstBlockNode.js";
import { AstOperateNode } from "./nodes/AstOperateNode.js";
import { AstRootNode } from "./nodes/AstRootNode.js";

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
     * 当前正在处理的token
     * @type {Token}
     */
    nowToken = null;

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
     * 步进token
     * @returns {Token}
     */
    stepToken()
    {
        if (this.tokenIndex < this.tokens.length)
            return this.tokens[++this.tokenIndex];
        else
            return undefined;
    }

    /**
     * 获取下一个token
     * @returns {Token}
     */
    peekNextToken()
    {
        return this.tokens[this.tokenIndex + 1];
    }

    /**
     * 表达式循环
     */
    expressionLoop()
    { }

    /**
     * 代码块循环
     */
    blockLoop()
    {
        this.nowToken = this.tokens[this.tokenIndex];
        if (this.nowToken.type == "keyword")
        { // 关键字
            if (this.nowToken.keywordInfo.isValueType)
            { // 基础类型
                let type = this.nowToken;
                let name = this.stepToken();
                if (this.peekNextToken().type == "punc")
                { }
            }
        }
    }

    /**
     * 状态机主循环
     */
    mainLoop()
    {
        if (this.nowInBlock)
            this.blockLoop();
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
        this.nowToken = this.tokens[this.tokenIndex];
    }
}