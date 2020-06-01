<template>
  <div class="svg-wrap">
    <svg width="300" height="150">
      <ellipse
        cx="150"
        cy="75"
        rx="80"
        ry="40"
        style="fill:rgb(200,100,50);
stroke:rgb(0,0,100);stroke-width:2"
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
}
</style>

<script>
export default {
  name: "svg-tcircle1",
  data() {
    return {};
  }
};
</script>


