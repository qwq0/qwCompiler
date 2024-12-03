/**
 * 关键字信息
 */
export class KeywordInfo
{
    /**
     * 关键字表示一个基础类型
     */
    isValueType = false;

    /**
     * 关键字表示可变性
     */
    isVariability = false;

    /**
     * 关键字表示bool常量
     */
    isBoolConst = false;

    /**
     * 创建关键字信息
     * @param {{[x in keyof KeywordInfo]?: KeywordInfo[x]}} info 
     * @returns 
     */
    static create(info)
    {
        let ret = new KeywordInfo();
        Object.entries(info).forEach(o =>
        {
            ret[o[0]] = o[1];
        });
        Object.freeze(ret);
        return ret;
    }
}

/**
 * 关键字映射表
 * @type {Map<string, KeywordInfo>}
 */
export let keywordMap = new Map([
    ["const", KeywordInfo.create({ isVariability: true })],

    ["void", KeywordInfo.create({ isValueType: true })],
    ["int", KeywordInfo.create({ isValueType: true })],
    ["uint", KeywordInfo.create({ isValueType: true })],
    ["int8", KeywordInfo.create({ isValueType: true })],
    ["int16", KeywordInfo.create({ isValueType: true })],
    ["int32", KeywordInfo.create({ isValueType: true })],
    ["int64", KeywordInfo.create({ isValueType: true })],
    ["uint8", KeywordInfo.create({ isValueType: true })],
    ["uint16", KeywordInfo.create({ isValueType: true })],
    ["uint32", KeywordInfo.create({ isValueType: true })],
    ["uint64", KeywordInfo.create({ isValueType: true })],
    ["int128", KeywordInfo.create({ isValueType: true })],
    ["float", KeywordInfo.create({ isValueType: true })],
    ["float32", KeywordInfo.create({ isValueType: true })],
    ["float64", KeywordInfo.create({ isValueType: true })],
    ["string", KeywordInfo.create({ isValueType: true })],
    ["bool", KeywordInfo.create({ isValueType: true })],

    ["true", KeywordInfo.create({ isBoolConst: true })],
    ["false", KeywordInfo.create({ isBoolConst: true })],

    ["tuple", KeywordInfo.create({})],
    ["class", KeywordInfo.create({})],
    ["template", KeywordInfo.create({})],
    ["this", KeywordInfo.create({})],

    ["if", KeywordInfo.create({})],
    ["else", KeywordInfo.create({})],
    ["switch", KeywordInfo.create({})],
    ["case", KeywordInfo.create({})],
    ["while", KeywordInfo.create({})],
    ["do", KeywordInfo.create({})],
    ["for", KeywordInfo.create({})],
    ["continue", KeywordInfo.create({})],
    ["break", KeywordInfo.create({})],

    ["async", KeywordInfo.create({})],
    ["await", KeywordInfo.create({})],
    ["return", KeywordInfo.create({})],
    ["goto", KeywordInfo.create({})],
    ["try", KeywordInfo.create({})],
    ["catch", KeywordInfo.create({})],
    ["throw", KeywordInfo.create({})],
    ["import", KeywordInfo.create({})],
    ["export", KeywordInfo.create({})]
]);