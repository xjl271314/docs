<style lang="scss">
.statistic-container {
  display: flex;
  align-items: center;
  font-family: "Avenir Next", Avenir, "Helvetica Neue", Helvetica, Arial,
    sans-serif;
  *,
  *::after,
  *::before {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }
  font-size: 16px;
  >span{
      margin-right: 1em;
      >span{
          font-weight: 400;
          color: #aaa;
          padding-left: .25em;
      }
  }
}
.icobutton {
  font-size: 1.2em;
  position: relative;
  margin: 0;
  padding: 0;
  color: #c0c1c3;
  border: 0;
  background: none;
  overflow: visible;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.icobutton .fa {
  display: block;
  padding: 0 0.1em;
}

.icobutton__text {
  font-size: 0.75em;
  position: absolute;
  top: 100%;
  left: -50%;
  width: 200%;
  text-align: center;
  line-height: 1.5;
  color: #a6a6a6;
}

.icobutton__text--side {
  top: 0;
  left: 100%;
  width: 100%;
  width: auto;
  padding: 0 0 0 0.25em;
}

/* fix for mo.js */
.icobutton svg {
  left: 0;
}

.icobutton:hover,
.icobutton:focus,
.icobutton:disabled {
  outline: none;
  color: rgb(152, 138, 222);
}

/* Unicorn */
.icobutton--unicorn svg {
  fill: #c0c1c3;
}
</style>
<template>
  <div refs="container" class="statistic-container">
    <span>全局访问量:<span>{{ this.visitNum }}</span></span>
    <span>Star:<span>{{ this.likeNum }}</span></span>
    <!-- 点赞按钮 -->
    <button
      ref="button"
      class="icobutton icobutton--thumbs-up"
      @click="handleLike"
      :disabled="isDisabled"
    >
      <span ref="span" class="fa fa-thumbs-up"></span>
    </button>
  </div>
</template>

<script>
import mojs from "../util/mo.min.js";

export default {
  name: "Statistic",
  data() {
    return {
      key: "cfba00864a7da46d",
      visitNum: 0,
      likeNum: 0,
      isDisabled: false
    };
  },
  methods: {
    handleLike() {
      ViLike.like(this.key, like => {
        // 点赞数即时更新
        this.likeNum = like;
        // 点击后按钮状态应为Disabled
        this.isDisabled = true;
      });
    }
  },
  mounted() {
      ViLike.get(this.key, (visit, like, islike) => {
        // 访问量
        this.visitNum = visit;
        // 点赞数
        this.likeNum = like;
        // 点赞按钮逻辑
        if (islike) {
          this.isDisabled = true;
        }
      });

      const $button = this.$refs.button;
      function extend(a, b) {
        for (var key in b) {
          if (b.hasOwnProperty(key)) {
            a[key] = b[key];
          }
        }
        return a;
      }

      function Animocon(el, options) {
        this.options = extend({}, this.options);
        extend(this.options, options);

        this.checked = false;

        this.timeline = new mojs.Timeline();

        for (var i = 0, len = this.options.tweens.length; i < len; ++i) {
          this.timeline.add(this.options.tweens[i]);
        }

        var self = this;
        el.addEventListener("click", function() {
          if (!self.isDisabled) {
            self.options.onCheck();
            self.timeline.start();
          }
          self.checked = !self.checked;
        });
      }

      Animocon.prototype.options = {
        tweens: [
          new mojs.Burst({
            shape: "circle",
            isRunLess: true
          })
        ],
        onCheck: function() {
          return false;
        },
        onUnCheck: function() {
          return false;
        }
      };
      new Animocon($button, {
        tweens: [
          // burst animation
          new mojs.Burst({
            parent: $button,
            duration: 1700,
            shape: "circle",
            fill: "#C0C1C3",
            x: "50%",
            y: "50%",
            opacity: 0.6,
            childOptions: { radius: { 15: 0 } },
            radius: { 30: 90 },
            count: 6,
            isRunLess: true,
            easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
          }),
          // ring animation
          new mojs.Transit({
            parent: $button,
            duration: 700,
            type: "circle",
            radius: { 0: 60 },
            fill: "transparent",
            stroke: "#C0C1C3",
            strokeWidth: { 20: 0 },
            opacity: 0.6,
            x: "50%",
            y: "50%",
            isRunLess: true,
            easing: mojs.easing.sin.out
          }),
          // icon scale animation
          new mojs.Tween({
            duration: 1200,
            onUpdate: function(progress) {
              if (progress > 0.3) {
                var elasticOutProgress = mojs.easing.elastic.out(
                  1.43 * progress - 0.43
                );
                $span.style.WebkitTransform = $span.style.transform =
                  "scale3d(" +
                  elasticOutProgress +
                  "," +
                  elasticOutProgress +
                  ",1)";
              } else {
                $span.style.WebkitTransform = $span.style.transform =
                  "scale3d(0,0,1)";
              }
            }
          })
        ],
        onCheck: function() {
          $button.style.color = "#988ADE";
        },
        onUnCheck: function() {
          $button.style.color = "#C0C1C3";
        }
      });
  }
};
</script>