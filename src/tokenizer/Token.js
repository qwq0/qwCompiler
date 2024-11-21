/**
 * 分出的词类
 */
export class Token
{
    /**
     * 类别
     * @type {"none" | "keyword" | "punc" | "identifier" | "number" | "literalString"}
     */
    type = "none";

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
}