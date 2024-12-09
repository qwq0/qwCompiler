/**
 * 关键字信息
 */
export class KeywordInfo
{
    /**
     * 关键字名
     */
    name = "";

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
     * 关键字是控制语句关键字
     */
    isControl = false;

    /**
     * 创建关键字信息
     * @param {string} name
     * @param {{[x in keyof KeywordInfo]?: KeywordInfo[x]}} info 
     * @returns 
     */
    static create(name, info)
    {
        let ret = new KeywordInfo();
        Object.entries(info).forEach(o =>
        {
            ret[o[0]] = o[1];
        });
        ret.name = name;
        Object.freeze(ret);
        return ret;
    }
}

/**
 * 关键字映射表
 * @type {Map<string, KeywordInfo>}
 */
export let keywordMap = new Map();

([
    KeywordInfo.create("const", { isVariability: true }),

    KeywordInfo.create("void", { isValueType: true }),
    KeywordInfo.create("int", { isValueType: true }),
    KeywordInfo.create("uint", { isValueType: true }),
    KeywordInfo.create("int8", { isValueType: true }),
    KeywordInfo.create("int16", { isValueType: true }),
    KeywordInfo.create("int32", { isValueType: true }),
    KeywordInfo.create("int64", { isValueType: true }),
    KeywordInfo.create("uint8", { isValueType: true }),
    KeywordInfo.create("uint16", { isValueType: true }),
    KeywordInfo.create("uint32", { isValueType: true }),
    KeywordInfo.create("uint64", { isValueType: true }),
    KeywordInfo.create("int128", { isValueType: true }),
    KeywordInfo.create("float", { isValueType: true }),
    KeywordInfo.create("float32", { isValueType: true }),
    KeywordInfo.create("float64", { isValueType: true }),
    KeywordInfo.create("string", { isValueType: true }),
    KeywordInfo.create("bool", { isValueType: true }),

    KeywordInfo.create("true", { isBoolConst: true }),
    KeywordInfo.create("false", { isBoolConst: true }),

    KeywordInfo.create("tuple", {}),
    KeywordInfo.create("class", {}),
    KeywordInfo.create("template", {}),
    KeywordInfo.create("this", {}),

    KeywordInfo.create("if", { isControl: true }),
    KeywordInfo.create("else", { isControl: true }),
    KeywordInfo.create("switch", { isControl: true }),
    KeywordInfo.create("case", { isControl: true }),
    KeywordInfo.create("while", { isControl: true }),
    KeywordInfo.create("do", { isControl: true }),
    KeywordInfo.create("for", { isControl: true }),
    KeywordInfo.create("continue", { isControl: true }),
    KeywordInfo.create("break", { isControl: true }),

    KeywordInfo.create("async", {}),
    KeywordInfo.create("await", {}),
    KeywordInfo.create("return", {}),
    KeywordInfo.create("goto", {}),
    KeywordInfo.create("try", {}),
    KeywordInfo.create("catch", {}),
    KeywordInfo.create("throw", {}),
    KeywordInfo.create("import", {}),
    KeywordInfo.create("export", {})
]).forEach(o =>
{
    keywordMap.set(o.name, o);
});