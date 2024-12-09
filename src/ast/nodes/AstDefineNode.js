import { AstNode } from "../AstNode.js";

/**
 * 定义节点
 */
export class AstDefineNode extends AstNode
{
    /**
     * 定义的变量或函数类型
     */
    type = "";

    /**
     * 定义的变量列表
     * @type {Array<{
     *  name: string
     * }>}
     */
    list = [];
}