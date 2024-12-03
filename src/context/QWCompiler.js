import { AstContext } from "../ast/AstContext.js";
import { Tokenizer } from "../tokenizer/Tokenizer.js";
import { WasmBuilder } from "../wasmBuilder/WasmBuilder.js";
import { CompileResult } from "./CompileResult.js";

/**
 * 编译器上下文
 * @typedef {{
 *  path: string,
 *  name?: string
 * }} ModuleInfo
 */
export class QWCompiler
{
    /**
     * 获取引用模块时触发
     * @type {(info: ModuleInfo) => string | Promise<string>}
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
     * @param {string} srcString
     * @param {ModuleInfo} [moduleInfo]
     * @returns {Promise<CompileResult>}
     */
    async compile(srcString, moduleInfo = { path: "" })
    {
        let tokenizeResult = (new Tokenizer()).tokenize(srcString);
        console.log(tokenizeResult);

        let astContext = new AstContext();
        astContext.addModule(moduleInfo.path, tokenizeResult);

        let result = new CompileResult();

        let wasmBuilder = new WasmBuilder();
        result.bin = wasmBuilder.buildBin();

        return result;
    }
}