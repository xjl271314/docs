<template>
  <div class="svg-wrap">
    <svg width="200" height="100" viewBox="0 0 200 100">
      <defs>
        <linearGradient id="Gradient01">
          <stop offset="20%" stop-color="#39F" />
          <stop offset="90%" stop-color="#F3F" />
        </linearGradient>
      </defs>
      <rect x="10" y="10" width="150" height="75" fill="url(#Gradient01)" />
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
  name: "svg-defs1",
  data() {
    return {};
  }
};
</script>


