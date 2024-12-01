import { encodeLEB128, encodeStrWithLen, encodeULEB128, spliceBufferList } from "../util/buffer.js";
import { FunctionType } from "./FunctionType.js";
import { ModuleContext } from "./ModuleContext.js";

/**
 * wasm构造器
 */
export class WasmBuilder
{
    /**
     * 函数类型
     * 根据传入参数和返回值类型区分
     * @type {Array<FunctionType>}
     */
    functionType = [];

    /**
     * 函数类型key 到 函数类型索引 映射
     * @type {Map<string, number>}
     */
    functionTypeIndexMap = new Map();

    /**
     * 函数列表
     * @type {Array<{
     *  module: string,
     *  name: string,
     *  type: string,
     *  isExport: boolean
     * }>}
     */
    functionList = [];

    /**
     * 函数名 到 函数索引 映射
     * @type {Map<string, number>}
     */
    functionIndexMap = new Map();

    /**
     * 导入的函数列表
     * @type {Array<{
     *  module: string,
     *  name: string,
     *  type: string
     * }>}
     */
    importFunctionList = [];

    /**
     * 导入函数名 到 导入函数索引 映射
     * @type {Map<string, number>}
     */
    importFunctionIndexMap = new Map();

    /**
     * 导出函数列表
     * @type {Array<{
     *  module: string,
     *  name: string,
     *  index: number
     * }>}
     */
    exportFunctionList = [];

    /**
     * @type {Map<string, ModuleContext>}
     */
    moduleContext = new Map();


    /**
     * 生成类型部分
     * @return {Uint8Array}
     */
    #ctType()
    {
        /** @type {Array<Uint8Array | Array<number>>} */
        let bufferList = [];

        bufferList.push(encodeULEB128(this.functionType.length));
        this.functionType.forEach(o =>
        {
            bufferList.push(o.ct());
        });

        return spliceBufferList(bufferList);
    }

    /**
     * 生成导入部分
     * @return {Uint8Array}
     */
    #ctImport()
    {
        /** @type {Array<Uint8Array | Array<number>>} */
        let bufferList = [];

        bufferList.push(encodeULEB128(this.importFunctionList.length));
        this.importFunctionList.forEach(o =>
        {
            bufferList.push(encodeStrWithLen(o.module));
            bufferList.push(encodeStrWithLen(o.name));
            bufferList.push([0x01]);
            bufferList.push(encodeULEB128(this.functionTypeIndexMap.get(o.type)));
        });

        return spliceBufferList(bufferList);
    }

    /**
     * 生成函数类型部分
     * @return {Uint8Array}
     */
    #ctFunctionList()
    {
        /** @type {Array<Uint8Array | Array<number>>} */
        let bufferList = [];

        bufferList.push(encodeULEB128(this.functionList.length));
        this.functionList.forEach(o =>
        {
            bufferList.push(encodeULEB128(this.functionTypeIndexMap.get(o.type)));
        });

        return spliceBufferList(bufferList);
    }

    /**
     * 生成内存信息部分
     * @return {Uint8Array}
     */
    #ctMemoryInfo()
    {
        /** @type {Array<Uint8Array | Array<number>>} */
        let bufferList = [];

        bufferList.push(encodeULEB128(1));
        bufferList.push([0]);
        bufferList.push(encodeULEB128(32));

        return spliceBufferList(bufferList);
    }

    /**
     * 生成全局变量信息部分
     * @return {Uint8Array}
     */
    #ctGlobalVariable()
    {
        /** @type {Array<Uint8Array | Array<number>>} */
        let bufferList = [];

        bufferList.push(encodeULEB128(0));

        return spliceBufferList(bufferList);
    }

    /**
     * 生成导出部分
     * @return {Uint8Array}
     */
    #ctExport()
    {
        /** @type {Array<Uint8Array | Array<number>>} */
        let bufferList = [];

        bufferList.push(encodeULEB128(this.exportFunctionList.length + 1));
        this.exportFunctionList.forEach(o =>
        {
            bufferList.push(encodeStrWithLen(o.name));
            bufferList.push([0]);
            bufferList.push(encodeULEB128(o.index));
        });
        // 导出内存
        bufferList.push(encodeStrWithLen("internal_memory"));
        bufferList.push([2]);
        bufferList.push(encodeULEB128(0));


        return spliceBufferList(bufferList);
    }

    /**
     * 生成字节码部分
     * @return {Uint8Array}
     */
    #ctCode()
    {
        /** @type {Array<Uint8Array | Array<number>>} */
        let bufferList = [];

        bufferList.push(encodeULEB128(this.functionList.length));


        return spliceBufferList(bufferList);
    }

    /**
     * 生成内存初始数据部分
     * @return {Uint8Array}
     */
    #ctMemoryData()
    {
        /** @type {Array<Uint8Array | Array<number>>} */
        let bufferList = [];

        bufferList.push(encodeULEB128(0));

        return spliceBufferList(bufferList);
    }


    /**
     * 构建二进制文件
     * @returns {Uint8Array}
     */
    buildBin()
    {
        /** @type {Array<Uint8Array | Array<number>>} */
        let bufferList = [];

        // 魔法数 0asm
        bufferList.push([0x00, 0x61, 0x73, 0x6d]);
        // 版本号
        bufferList.push([0x01, 0x00, 0x00, 0x00]);

        /**
         * 添加片段
         * @param {number} id 
         * @param {Uint8Array | Array<number>} content 
         */
        let pushSection = (id, content) =>
        {
            bufferList.push([id]);
            bufferList.push(encodeULEB128(content.length));
            bufferList.push(content);
        };

        // 类型
        pushSection(1, this.#ctType());

        // 导入
        pushSection(2, this.#ctImport());

        // 函数体
        pushSection(3, this.#ctFunctionList());

        // 表格
        // pushSection(4, []);

        // 内存
        pushSection(5, this.#ctMemoryInfo());

        // 全局变量
        pushSection(6, this.#ctGlobalVariable());

        // 导出
        pushSection(7, this.#ctExport());

        // 启动函数
        // pushSection(8, encodeLEB128(startFunctionIndex));

        // 字节码
        pushSection(10, this.#ctCode());

        // 内存初始值
        pushSection(11, this.#ctMemoryData());

        // 自定义部分
        // pushSection(0, []);

        return spliceBufferList(bufferList);
    }
}

