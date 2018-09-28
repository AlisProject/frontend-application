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
  background: linear-gradient(#858dda);
  border-radius: 18px;
  border: none;
  color: #fff;
  cursor: pointer;
  display: block;
  font-size: 14px;
  outline: none;
  padding: 10px;
  text-align: center;
  text-decoration: none;
  width: 265px;

  &:hover,
  &:focus {
    background: linear-gradient(314.72deg, #232538 0%, #858dda 100%);
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.25);
    transition: all 400ms ease;
  }

  &:target {
    display: block;
  }

  &.disabled {
    background: white;
    color: #6e6e6e;
    cursor: default;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  }

  a {
    color: #fff;
    text-decoration: none;
  }
}
</style>
