import { KeywordInfo, keywordMap } from "../table/keyword.js";

/**
 * 分出的词类
 */
export class Token
{
    /**
     * 类别
     * @type {"never" | "keyword" | "punc" | "identifier" | "number" | "literalString" | "annotation"}
     */
    type = "never";

    /**
     * 值
     * @type {string}
     */
    value = "";

    /**
     * 原值
     * 未处理过的值
     * @type {string}
     */
    orgValue = "";

    /**
     * 在源码中的起始索引
     * 包括此索引
     */
    startIndex = 0;

    /**
     * 在源码中的结束索引
     * 不包括此索引
     */
    endIndex = 0;

    /**
     * 获取关键词信息
     * @returns {KeywordInfo}
     */
    get keywordInfo()
    {
        if (this.type == "keyword")
            return keywordMap.get(this.value);
        else
            return null;
    }

    /**
     * 检测是否是指定token
     * @param {{
     *  [x in keyof Token]?: Token[x]
     * }} obj 
     */
    is(obj)
    {
        for (let o of Object.entries(obj))
        {
            if (this[o[0]] != o[1])
                return false;
        }
        return true;
    }
}