/**
 * 编译错误类
 */
export class CompilerError
{
    /**
     * 消息
     */
    message = "";
    /**
     * 错误发生的位置索引
     */
    index = 0;
    /**
     * 错误发生的模块
     */
    moduleName = "";
    /**
     * 第二错误发生的位置索引
     */
    secondIndex = 0;
    /**
     * 第二错误发生的模块
     */
    secondModuleName = "";

    /**
     * 创建编译错误
     * @param {string} message
     * @param {number} index
     * @param {string} [moduleName]
     */
    static create(message, index, moduleName = "")
    {
        let ret = new CompilerError();
        ret.message = message;
        ret.index = index;
        ret.moduleName = moduleName;
        return ret;
    }
}