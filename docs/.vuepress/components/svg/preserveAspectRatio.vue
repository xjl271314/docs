<template>
  <div class="svg-wrap">
    <svg id="pre-svg" width="400" height="200" viewBox="0 0 200 200" style="border:1px solid #cd0000;">
      <rect x="10" y="10" width="150" height="150" fill="#cd0000" />
    </svg>
    <div class="btns">
    <p>
      <input type="radio" id="radio0" name="ratio" value checked />
      <label for="radio0">无preserveAspectRatio</label>
    </p>
    <p>
      <input type="radio" id="radio1" name="ratio" value="meet" />
      <label for="radio1">meet</label>
    </p>
    <p>
      <input type="radio" id="radio2" name="ratio" value="slice" />
      <label for="radio2">slice</label>
    </p>
    <p>
      <input type="radio" id="radio3" name="ratio" value="none" />
      <label for="radio3">none</label>
    </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.svg-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 50px auto;
}
.btns{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>

<script>
export default {
  name: "svg-preserveAspectRatio",
  data() {
    return {
        behavior: ""
    };
  },
  mounted() {
    const that = this;
    const svg = document.querySelector('#pre-svg');
    svg &&[].slice
        .call(document.querySelectorAll("input[type=radio]"))
        .forEach(function(radio) {
          radio.addEventListener("click", function() {
            var value = this.value;
            if (value == "") {
              svg.removeAttribute("preserveAspectRatio");
              return;
            }
            if (value != "none") {
              value = "xMinYMin " + value;
            }
            svg.setAttribute("preserveAspectRatio", value);
          });
        });
  }
};
</script>


