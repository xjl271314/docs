<template>
  <div class="svg-wrap">
    <svg viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
      <rect width="10" height="10">
        <animate attributeName="rx" values="0;5;0" dur="10s" repeatCount="indefinite" />
      </rect>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.svg-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
  width: 100px;
  height: 100px;
  svg {
    width: 100%;
    background: transparent;
  }
}
</style>

<script>
export default {
  name: "svg-animate1",
  data() {
    return {};
  }
};
</script>


