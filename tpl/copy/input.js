<input type="text" id="input" value="17373383"> <br>
<button type="button" id="button">复制输入框中内容</button>
<script>
    (function(){
        button.addEventListener('click', function(){
            input.select();
            document.execCommand('copy');
            alert('复制成功');
        })
    })()
</script>