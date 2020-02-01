// https://clipboardjs.com/

// 例如, 你希望动态设置target, 你需要返回一个node节点.
new ClipboardJS('.btn', {
    target: function(trigger) {
        return trigger.nextElementSibling;
    }
});

// 如果你希望动态设置text, 你需要返回字符串。
new ClipboardJS('.btn', {
    text: function(trigger) {
        return trigger.getAttribute('aria-label');
    }
});