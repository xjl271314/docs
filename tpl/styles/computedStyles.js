/**
 * “DOM2 级样式”增强了 document.defaultView，提供了getComputedStyle()方法。
 * 返回一个 CSSStyleDeclaration 对象（与 style 属性的类型相同），其中包含当前元素的所有计算的样式
 * @param { htmlElement } el 要取得计算样式的元素 
 * @param { htmlHypocrisyElement } hypocrisy 一个伪元素字符串（例如":after"）。如果不需要伪元素信息，设置null。
 * @param { cssAttr } attr 要获取的css属性
 * 
 */
export function getComputedStyleAttr(el, hypocrisy = null, attr) {
    if (window.getComputedStyle) {
        return window.getComputedStyle(el, hypocrisy)[attr];
    }
    // IE 不支持 getComputedStyle()方法，但它有一种类似的概念。
    // 在 IE 中，每个具有 style 属性的元素还有一个 currentStyle 属性。
    return el.currentStyle[attr];
}
