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
  border-radius: 18px;
  border: none;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 14px;
  height: 36px;
  line-height: 36px;
  outline: none;
  position: relative;
  text-align: center;
  text-decoration: none;
  width: 256px;
  z-index: 0;

  &:before {
    background: #858dda;
    border-radius: 18px;
    content: '';
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transition: all 400ms ease;
    width: 100%;
    z-index: -1;
  }

  &:after {
    background: linear-gradient(314.72deg, #232538 0%, #858dda 100%);
    border-radius: 18px;
    content: '';
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: -2;
  }

  &:hover:enabled:before,
  &:focus:before {
    opacity: 0;
  }

  &:hover,
  &:focus {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.25);
  }

  &:target {
    display: block;
  }

  &[disabled] {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
    color: #6e6e6e;
    cursor: default;

    &:before,
    &:after {
      background: #fff;
    }
  }

  a {
    color: #fff;
    display: block;
    text-decoration: none;
    width: 100%;
  }
}
</style>

