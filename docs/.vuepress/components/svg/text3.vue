<template>
  <div class="svg-wrap">
    <svg width="500" height="200">
      <defs>
        <path id="path1" d="M75,50 a1,1 0 0,0 150,0" />
      </defs>
      <text x="10" y="100" style="fill:green;">
        <textPath xlink:href="#path1">I am magic svg path text </textPath>
      </text>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.svg-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
}
</style>

<script>
export default {
  name: "svg-text3",
  data() {
    return {};
  }
};
</script>


