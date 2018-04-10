<template>
  <div class="area-loader">
    <no-ssr>
      <div class="loader" v-if="lastEvaluatedKey !== undefined">Loading...</div>
    </no-ssr>
  </div>
</template>

<script>
export default {
  props: {
    lastEvaluatedKey: {
      type: Object,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
.area-loader {
  grid-area: loader;
}

.loader,
.loader:before,
.loader:after {
  border-radius: 50%;
  width: 2.5em;
  height: 2.5em;
  animation-fill-mode: both;
  animation: load7 1.8s infinite ease-in-out;
}

.loader {
  color: #d8d8d8;
  font-size: 10px;
  margin: 0 auto;
  position: relative;
  text-indent: -9999em;
  transform: translateZ(0);
  animation-delay: -0.16s;
}

.loader:before,
.loader:after {
  content: '';
  position: absolute;
  top: 0;
}

.loader:before {
  left: -3.5em;
  animation-delay: -0.32s;
}

.loader:after {
  left: 3.5em;
}

@keyframes load7 {
  0%,
  80%,
  100% {
    box-shadow: 0 2.5em 0 -1.3em;
  }
  40% {
    box-shadow: 0 2.5em 0 0;
  }
}
</style>
