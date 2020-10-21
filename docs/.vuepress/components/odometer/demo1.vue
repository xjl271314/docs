<template>
  <div class="demo-wrap">
    <div class="number" ref="demo">{{ defaultNum }}</div>
    <div class="flex-row">
      <button @click="addNum">点我更新</button>
      <button @click="reset">点我重置</button>
    </div>
  </div>
</template>

<style lang="scss">
.odometer-theme-coin-animate-defualt {
  transform: translateY(1px);
}
.odometer-digit-spacer {
  display: none;
}
</style>
<style scoped lang="scss">
.number {
  font-size: 30px;
  margin-bottom: 0.2em;
}

.demo-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.flex-row {
  display: flex;
  align-items: center;
  justify-content: center;
  button {
    width: 100px;
    height: 50px;
    margin-right: 0.5em;
    outline: none;
    border: none;
    text-align: center;
    font-size: 16px;
  }
}
</style>

<script>
import Odometer from "odometer";

export default {
  name: "odometer-demo1",
  data() {
    return {
      defaultNum: 0,
    };
  },
  methods: {
    addNum() {
      this.od = new Odometer({
        el: this.$refs.demo,
        value: 0,
        duration: 2000,
        dot: 0,
        animation: "count",
        format: "",
        theme: "coin-animate-defualt",
      });

      this.od.update(8888);
    },

    reset() {
      this.od.update(0);
    },
  },
};
</script>


