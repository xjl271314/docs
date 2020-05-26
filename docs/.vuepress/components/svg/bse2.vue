<template>
  <div class="svg-wrap">
    <!--三次贝塞尔曲线简写-->
    <svg width="190px" height="160px" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80" stroke="black" fill="transparent" />
      <circle cx="10" cy="80" r="2" fill="red" />
      <circle cx="40" cy="10" r="2" fill="red" />
      <line x1="10" y1="80" x2="40" y2="10" style="stroke:rgb(255,0,0);stroke-width:1" />

      <circle cx="65" cy="10" r="2" fill="red" />
      <circle cx="95" cy="80" r="2" fill="red" />
      <line x1="65" y1="10" x2="95" y2="80" style="stroke:rgb(255,0,0);stroke-width:1" />

      <circle cx="125" cy="150" r="2" fill="blue" />
      <circle cx="180" cy="80" r="2" fill="red" />
      <circle cx="150" cy="150" r="2" fill="red" />
      <line x1="95" y1="80" x2="125" y2="150" style="stroke:blue;stroke-width:1" />
      <line x1="180" y1="80" x2="150" y2="150" style="stroke:rgb(255,0,0);stroke-width:1" />
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
    background: #ccc;
  }
}
</style>

<script>
export default {
  name: "svg-bse2",
  data() {
    return {};
  }
};
</script>


