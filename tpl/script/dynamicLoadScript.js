/**
 * 动态加载js脚本
 * @param {string} url 
 * @param {function} callBack 
 */
export function loadScript(url, callBack) {
    let script = document.createElement('script');
    script.type = "text/javascript";
    if (typeof (callBack) != "undefined") {
        if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState === "loaded" || script.readyState === "complete") {
                    script.onreadystatechange = null;
                    callBack();
                }
            }
        } else {
            script.onload = function () {
                callBack();
            }
        }
    }
    script.src = url;
    document.body.appendChild(script);
}