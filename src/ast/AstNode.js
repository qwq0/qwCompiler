/**
 * ast树的节点
 */
export class AstNode
{
    /**
     * 子节点类型
     * @type {string}
     */
    type = "";

    /**
     * 子节点
     * @type {Array<AstNode>}
     */
    child = [];
}