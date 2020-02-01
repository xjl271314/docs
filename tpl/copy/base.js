/**
 * HTML5 提供了复制功能的如下API：
 * document.createRange(): 创建选中容器，返回一个 range Object，支持移动端和 PC 端。
 * selectNode(DOM): 返回 range Object 上挂载的方法，用来添加选中元素，只能添加一个。
 * window.getSelection()：用来获得当前选中的元素的内容。一般而言就是用鼠标选中页面上的内容。
 * addRange(range): 这个方法是挂载到 getSelection()方法下的，用来执行元素的选中。
 */

(function () {
    document.body.addEventListener('click', function () {
        // #content为要复制的元素
        const copyDom = document.querySelector('#content');
        // 创建选中范围
        const range = document.createRange();
        range.selectNode(copyDom);
        // 移除剪切板中内容
        window.getSelection().removeAllRanges();
        // 添加新的内容到剪切板
        window.getSelection().addRange(range);
        // 复制
        const successful = document.execCommand('copy');

        try {
            const msg = successful ? "successful" : "failed";
            alert('Copy command was : ' + msg);
        } catch (err) {
            alert('Oops , unable to copy!');
        }
    })
})()