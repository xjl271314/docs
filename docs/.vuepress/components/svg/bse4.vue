<template>
  <div class="svg-wrap">
    <!--二次贝塞尔曲线简写-->
    <svg width="190px" height="160px" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 80 Q 52.5 10, 95 80 T  180 80" stroke="black" fill="transparent" />

      <circle cx="10" cy="80" r="2" fill="red" />
      <circle cx="52.5" cy="10" r="2" fill="red" />
      <line x1="10" y1="80" x2="52.5" y2="10" style="stroke:rgb(255,0,0);stroke-width:1" />

      <circle cx="95" cy="80" r="2" fill="red" />
      <line x1="95" y1="80" x2="52.5" y2="10" style="stroke:rgb(255,0,0);stroke-width:1" />

      <circle cx="180" cy="80" r="2" fill="blue" />
      <circle cx="137.5" cy="150" r="2" fill="blue" />
      <line x1="95" y1="80" x2="137.5" y2="150" style="stroke:rgb(0,0,255);stroke-width:1" />
      <line x1="137.5" y1="150" x2="180" y2="80" style="stroke:rgb(0,0,255);stroke-width:1" />
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
  name: "svg-bse4",
  data() {
    return {};
  }
};
</script>


