import { encodeULEB128, spliceBufferList } from "../util/buffer.js";

/**
 * @type {Map<string, number>}
 */
let valueTypeMap = new Map([
    ["i32", 0x7f],
    ["i64", 0x7e],
    ["f32", 0x7d],
    ["f64", 0x7c],
]);

/**
 * wasm函数类型
 */
export class FunctionType
{
    /**
     * 参数类型
     * @type {Array<"i32" | "i64" | "f32" | "f64">}
     */
    paramType = [];
    /**
     * 返回值类型
     * @type {Array<"i32" | "i64" | "f32" | "f64">}
     */
    returnType = [];

    /**
     * 字符串化e函数类型描述
     * @returns {string}
     */
    key()
    {
        let ret = this.paramType.join(",") + ":" + this.returnType.join(",");
        return ret;
    }

    /**
     * 生成wasm二进制格式
     * @return {Uint8Array}
     */
    ct()
    {
        /** @type {Array<Uint8Array | Array<number>>} */
        let bufferList = [];
        bufferList.push([0x60]);
        bufferList.push(encodeULEB128(this.paramType.length));
        bufferList.push(this.paramType.map(o => valueTypeMap.get(o)));
        bufferList.push(encodeULEB128(this.returnType.length));
        bufferList.push(this.returnType.map(o => valueTypeMap.get(o)));
        return spliceBufferList(bufferList);
    }
}