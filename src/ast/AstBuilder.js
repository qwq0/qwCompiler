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
     * 代码块循环
     */
    blockLoop()
    {
        let isFunctionDefine = false;
        let isVariableDefine = false;
        let isExpression = false;
        let isControl = false;
        let defineType = "";

        if (this.nowToken?.type == "keyword")
        { // 关键字
            if (this.nowToken.keywordInfo.isValueType)
            { // 基础类型
                defineType = this.nowToken.value;

                if (this.peekToken(2)?.is({ type: "punc", value: "(" }))
                {
                    // 0   1 2 3 4
                    // int a ( ) { ... }
                    isFunctionDefine = true;
                }
                else
                {
                    // 0   1 2
                    // int a ;
                    isVariableDefine = true;
                }
            }
            else if (this.nowToken.keywordInfo.isControl)
            { // 控制语句
                isControl = true;
            }
            else
            { // 表达式
                isExpression = true;
            }
        }
        else
        { // 表达式
            isExpression = true;
        }

        if (isExpression)
        {
            this.expressionLoop();
        }
        else if (isVariableDefine)
        { }
        else if (isFunctionDefine)
        { }
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
    }
}