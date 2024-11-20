/**
 * 分出的词类
 */
export class Token
{
    /**
     * 类别
     * @type {"none" | "keyword" | "punc" | "identifier" | "literal"}
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
}