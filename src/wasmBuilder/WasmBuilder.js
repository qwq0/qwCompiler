/**
 * wasm构造器
 */
export class WasmBuilder
{
    /**
     * 函数类型
     * 根据传入参数和返回值类型区分
     * @type {Array<{}>}
     */
    functionType = [];

    /**
     * 函数列表
     * @type {Array<{}>}
     */
    functionList = [];

    /**
     * 函数名 到 函数索引 映射
     * @type {Map<string, number>}
     */
    functionIndexMap = new Map();

    /**
     * 导入函数名 到 导入函数索引 映射
     * @type {Map<string, number>}
     */
    importFunctionIndexMap = new Map();

    /**
     * 构建二进制文件
     * @returns {Uint8Array}
     */
    buildBin()
    {
        /**
         * @type {Array<Uint8Array | Array<number>>}
         */
        let bufferList = [];

        // 魔法数 0asm
        bufferList.push([0x00, 0x61, 0x73, 0x6d]);
        // 版本号
        bufferList.push([0x01, 0x00, 0x00, 0x00]);

        /**
         * 
         * @param {number} id 
         * @param {Uint8Array | Array<number>} content 
         */
        let pushSection = (id, content) =>
        {
            bufferList.push([id]);
            bufferList.push(encodeLEB128(content.length));
            bufferList.push(content);
        };

        // 函数类型
        pushSection(1, []);

        // 导入
        pushSection(2, []);

        // 函数体
        pushSection(3, []);

        // 表格
        // pushSection(4, []);

        // 内存
        pushSection(5, [
            ...encodeLEB128(1),
        ]);

        // 全局变量
        pushSection(6, []);

        // 导出
        pushSection(7, []);

        // 启动函数
        // pushSection(8, encodeLEB128(startFunctionIndex));

        // 字节码
        pushSection(10, []);

        // 内存初始值
        pushSection(11, []);

        // 自定义部分
        // pushSection(0, []);

        let nowBinIndex = 0;
        let ret = new Uint8Array(
            bufferList.reduce((p, o) => p + o.length, 0)
        );
        for (let o of bufferList)
        {
            ret.set(o, nowBinIndex);
            nowBinIndex += o.length;
        }
        return ret;
    }
}

/**
 * 编码leb128数字
 * @param {number | bigint} value
 * @returns {Uint8Array}
 */
function encodeLEB128(value)
{
    if (!Number.isInteger(value))
        throw "cannot encode a float number to leb128";
    if (typeof (value) == "bigint")
        return encodeBigLEB128(value);
    if (value > 2147483647 || value < -2147483648)
        return encodeBigLEB128(BigInt(value));
    let bytes = [];
    if (value >= 0)
    {
        while (true)
        {
            let now = value & 0x7f;
            value >>>= 7;
            if (value == 0 && (now & 0x40) == 0)
            {
                bytes.push(now);
                break;
            }
            bytes.push(now | 0x80);
        }
    }
    else
    {
        while (true)
        {
            let now = value & 0x7f;
            value >>= 7;
            if (value == -1 && (now & 0x40) != 0)
            {
                bytes.push(now);
                break;
            }
            bytes.push(now | 0x80);
        }
    }
    return (new Uint8Array(bytes));
}

/**
 * 编码大数字到leb128
 * @param {bigint} value
 * @returns {Uint8Array}
 */
function encodeBigLEB128(value)
{
    if (!Number.isInteger(value))
        throw "cannot encode a float number to leb128";
    let bytes = [];
    if (value >= 0)
    {
        while (true)
        {
            let now = value & 0x7fn;
            value >>= 7n;
            if (value == 0n && (now & 0x40n) == 0n)
            {
                bytes.push(Number(now));
                break;
            }
            bytes.push(Number(now | 0x80n));
        }
    }
    else
    {
        while (true)
        {
            let now = value & 0x7fn;
            value >>= 7n;
            if (value == -1n && (now & 0x40n) != 0n)
            {
                bytes.push(Number(now));
                break;
            }
            bytes.push(Number(now | 0x80n));
        }
    }
    return (new Uint8Array(bytes));
}