import { Token } from "../tokenizer/Token.js";
import { TokenizeResult } from "../tokenizer/TokenizeResult.js";
import { AstBuilder } from "./AstBuilder.js";
import { AstModule } from "./AstModule.js";

/**
 * ast上下文
 */
export class AstContext
{
    /**
     * 模块名 到 模块上下文 映射
     * @type {Map<string, AstModule>}
     */
    moduleMap = new Map();

    /**
     * 需要的模块名 到 模块信息 映射
     * @type {Map<string, {
     *  path: string,
     *  currentPath: string
     * }>}
     */
    needModules = new Map();

    /**
     * 添加模块
     * @param {string} moduleName
     * @param {TokenizeResult} tokenResult
     */
    addModule(moduleName, tokenResult)
    {
        let moduleContext = new AstModule();

        let builder = new AstBuilder();
        builder.setTokens(tokenResult);
        builder.build();

        this.moduleMap.set(moduleName, moduleContext);
    }
}