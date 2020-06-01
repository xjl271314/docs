<template>
  <div class="svg-wrap">
    <svg width="300" height="300">
      <rect
        x="20"
        y="20"
        width="250"
        height="250"
        style="fill:blue;stroke:pink;stroke-width:5;
fill-opacity:0.1;stroke-opacity:0.9"
      />
    </svg>
  </div>
</template>

<style scoped lang="scss">
.svg-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
  svg{
      background: yellow;
  }
}
</style>

<script>
export default {
  name: "svg-rect2",
  data() {
    return {};
  }
};
</script>


