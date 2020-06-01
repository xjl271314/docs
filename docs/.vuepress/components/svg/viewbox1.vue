<template>
  <div class="demo">
    <p>
      <strong id="text">点击下一步，显示viewBox区域</strong>
    </p>
    <svg id="cover" width="40" height="30" viewBox="0 0 40 30" class="cover">
      <rect x="10" y="5" width="20" height="15" fill="#cd0000" />
    </svg>
    <svg id="svg" width="400" height="300" style="border:1px solid #cd0000;">
      <rect x="10" y="5" width="20" height="15" fill="#cd0000" />
    </svg>
    <p>
      <input id="button" type="button" value="下一步" @click="next" />
    </p>
  </div>
</template>

<style scoped lang="scss">
.cover {
  width: 40px;
  height: 30px;
  display: none;
  position: absolute;
  border: 1px solid #cd0000;
  -webkit-transition: all 1s;
  transition: all 1s;
}
</style>

<script>
export default {
  name: "svg-viewbox1",
  data() {
    return {
      step: 0,
      timer: null,
      width: 40,
      height: 30
    };
  },
  methods: {
    next() {
      const svg = document.getElementById("svg"),
        button = document.getElementById("button"),
        cover = document.getElementById("cover"),
        text = document.getElementById("text");

      if (svg && button) {
        if (this.timer != null) return;
        this.step++;

        if (this.step == 1) {
          cover.style.display = "block";
          text.innerHTML = "点击下一步，执行视区全屏动画";
          svg.getElementsByTagName("rect")[0].style.display = "none";
        } else if (this.step == 2) {
          cover.style.width = "400px";
          cover.style.height = "300px";
          let that = this;
          this.timer = setTimeout(function() {
            text.innerHTML = "点击下一步，状态还原";
            clearTimeout(that.timer);
            that.timer = null;
          }, 1000);
        } else if (this.step == 3) {
          cover.style.display = "none";
          cover.style.width = "";
          cover.style.height = "";
          svg.getElementsByTagName("rect")[0].style.display = "";
          text.innerHTML = "点击下一步，显示viewBox区域";
          this.step = 0;
          this.timer = null;
        }
      }
    }
  }
};
</script>


