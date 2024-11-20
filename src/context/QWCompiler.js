import { CompileResult } from "./CompileResult.js";

/**
 * 编译器上下文
 */
export class QWCompiler
{
    /**
     * 获取引用模块时触发
     * @type {(info: {
     *  path: string,
     *  currentPath: string,
     *  name?: string
     * }) => string | Promise<string>}
     */
    #onGetModule = (_info) =>
    {
        throw "The external module cannot be referenced because module fetch processing is not set";
    };

    /**
     * @param {(info: {
     *  path: string,
     *  currentPath: string,
     *  name?: string
     * }) => string | Promise<string>} onGetModule
     */
    setOnGetModule(onGetModule)
    {
        this.#onGetModule = onGetModule;
    }

    /**
     * 编译
     * @param {string} modulePath
     * @param {string} srcString
     * @returns {Promise<CompileResult>}
     */
    async compile(modulePath, srcString)
    {
        return;
    }
}