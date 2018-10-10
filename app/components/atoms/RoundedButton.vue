<template>
  <button
    class="rounded-button"
    :class="{
      'is-fluid': fluid
    }"
    @click="handleClick"
  >
    <span class="rounded-button__inner">
      <slot />
    </span>
  </button>
</template>

<script>
export default {
  props: {
    fluid: Boolean
  },
  methods: {
    handleClick(event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style scoped>
.rounded-button {
  color: #fff;
  background: #0086cc;
  font-weight: bold;
  border-radius: 50px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  margin: 0;
  padding: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.rounded-button.is-fluid {
  width: 100%;
  flex: 1;
}

.rounded-button__inner {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 30px;
}
</style>
