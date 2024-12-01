/**
 * 编码leb128数字
 * @param {number | bigint} value
 * @returns {Uint8Array}
 */
export function encodeLEB128(value)
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
    let bytes = [];
    if (value >= 0n)
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

/**
 * 编码leb128无符号数字
 * @param {number | bigint} value
 * @returns {Uint8Array}
 */
export function encodeULEB128(value)
{
    if (!Number.isInteger(value))
        throw "cannot encode a float number to leb128";
    if (typeof (value) == "bigint")
        return encodeBigULEB128(value);
    if (value > 2147483647)
        return encodeBigULEB128(BigInt(value));
    if (value < 0)
        throw "cannot encode a negative int to uleb128";
    let bytes = [];
    if (value >= 0)
    {
        while (true)
        {
            let now = value & 0x7f;
            value >>>= 7;
            if (value == 0)
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
 * 编码无符号大数字到leb128
 * @param {bigint} value
 * @returns {Uint8Array}
 */
function encodeBigULEB128(value)
{
    if (value < 0n)
        throw "cannot encode a negative int to uleb128";
    let bytes = [];
    while (true)
    {
        let now = value & 0x7fn;
        value >>= 7n;
        if (value == 0n)
        {
            bytes.push(Number(now));
            break;
        }
        bytes.push(Number(now | 0x80n));
    }
    return (new Uint8Array(bytes));
}

let textEncode = new TextEncoder();

/**
 * 编码字符串为带长度的格式
 * @param {string} str 
 * @returns {Uint8Array}
 */
export function encodeStrWithLen(str)
{
    let content = textEncode.encode(str);
    let len = encodeULEB128(content.length);
    let ret = new Uint8Array(len.length + content.length);
    ret.set(len, 0);
    ret.set(content, len.length);
    return ret;
}

/**
 * 拼接buffer列表为一整个buffer
 * @param {Array<Uint8Array | Array<number>>} bufferList
 * @returns {Uint8Array}
 */
export function spliceBufferList(bufferList)
{
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