<template>
  <button class="app-button" :disabled="disabled" @click="callback($event)">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      required: false
    }
  },
  methods: {
    callback(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-button {
  background: #0086cc;
  border-radius: 18px;
  border: none;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  outline: none;
  padding: 0;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: box-shadow 400ms ease;
  width: 256px;

  &:hover,
  &:focus {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.25);
  }

  &:target {
    display: block;
  }

  &[disabled] {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
    color: #fff;
    cursor: default;
    opacity: 0.5;
  }

  a {
    color: #fff;
    display: block;
    text-decoration: none;
    width: 100%;
  }
}
</style>
