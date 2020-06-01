<template>
  <div class="svg-wrap">
    <svg width="300" height="140">
      <rect
        x="20"
        y="20"
        rx="20"
        ry="20"
        width="250"
        height="100"
        style="fill:red;stroke:black;
stroke-width:5;opacity:0.5"
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
  svg {
    background: yellow;
  }
}
</style>

<script>
export default {
  name: "svg-rect3",
  data() {
    return {};
  }
};
</script>


