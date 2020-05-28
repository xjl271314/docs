<template>
  <div class="svg-wrap">
    <svg
      width="120"
      height="120"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      xmlns:xlink="http://www.w3.org/1999/xlink"
    >
      <polygon points="60,30 90,90 30,90">
        <animateTransform
          attributeName="transform"
          attributeType="XML"
          type="rotate"
          from="0 60 70"
          to="360 60 70"
          dur="10s"
          repeatCount="indefinite"
        />
      </polygon>
    </svg>
  </div>
</template>

<style scoped lang="scss">
.svg-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 50px auto;
  width: 120px;
  height: 120px;
  svg {
    width: 100%;
    background: transparent;
    fill: rgb(random(255), random(255), random(255));
  }
}
</style>

<script>
export default {
  name: "svg-animate2",
  data() {
    return {};
  }
};
</script>


