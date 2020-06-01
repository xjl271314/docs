<template>
  <div class="svg-wrap">
    <svg width="300" height="150" viewBox="0 0 140 75">
      <g stroke="#333" fill="transparent" stroke-width="5">
        <circle cx="25" cy="25" r="20" />
        <circle cx="55" cy="25" r="20" />
        <circle cx="85" cy="25" r="20" />
        <circle cx="115" cy="25" r="20" />
      </g>
      <text x="55" y="70" stroke="red" fill="red">Audi</text>
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
  name: "svg-g1",
  data() {
    return {};
  }
};
</script>


