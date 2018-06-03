<template>
  <button class="app-button" :class="{ disabled }" @click="callback($event)">
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
  background: linear-gradient(134.72deg, #232538 0%, #858dda 100%);
  border-radius: 18px;
  border: none;
  box-shadow: 0 0 10px gray;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 14px;
  outline: none;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  width: 265px;

  &:focus {
    opacity: 0.8;
  }

  &:target {
    display: block;
  }

  &.disabled {
    background: white;
    color: #6e6e6e;
    cursor: default;
  }

  a {
    color: #fff;
    text-decoration: none;
  }
}
</style>
