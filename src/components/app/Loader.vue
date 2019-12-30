<template>
  <div class="app-loader">
    <div class="preloader-wrapper active">
      <div class="spinner-layer" :class="color">
        <div class="circle-clipper left">
          <div class="circle"></div>
        </div>
        <div class="gap-patch">
          <div class="circle"></div>
        </div>
        <div class="circle-clipper right">
          <div class="circle"></div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import randomIntFromInterval from "@/utils/random";
export default {
  computed: {
    color() {
      const colors = [
        "spinner-red-only",
        "spinner-blue-only",
        "spinner-green-only"
      ];
      return colors[randomIntFromInterval(0, 2)];
    }
  }
};
</script>
