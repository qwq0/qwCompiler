import { IntermCode } from "../intermediate/IntermCode.js";

/**
 * 需要编译的函数的封装
 */
export class WasmFunction
{
    /**
     * 可标识的函数名
     */
    name = "";

    /**
     * 函数所在的模块名
     */
    module = "";

    /**
     * 函数的key
     * 由模块名称和函数本身的名称组成
     */
    key = "";

    /**
     * @type {IntermCode}
     */
    intermCode = null;
}