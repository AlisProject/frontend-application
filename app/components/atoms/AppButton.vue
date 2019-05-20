<template>
  <button class="app-button" :class="type" :disabled="disabled" @click="callback($event)">
    <i v-if="isLoading" class="fa fa-spinner fa-pulse fa-fw" /><slot />
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      required: false
    },
    type: {
      type: String,
      validator(val) {
        return ['secondary'].includes(val)
      }
    },
    isLoading: {
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
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.25);
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
  transition: all 400ms ease;
  width: 256px;

  &:hover,
  &:focus {
    background: #006ca4;
  }

  &:active {
    box-shadow: none;
  }

  &:target {
    display: block;
  }

  &[disabled] {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
    color: #fff;
    cursor: default;
    opacity: 0.5;

    &:hover,
    &:focus {
      background: #0086cc;
    }

    a {
      cursor: default;
    }
  }

  a {
    color: #fff;
    display: block;
    text-decoration: none;
    width: 100%;
  }

  &.secondary {
    background: #fff;
    box-shadow: none;
    border: 1px solid #0086cc;
    color: #0086cc;

    &:hover,
    &:focus {
      background: #fff;
    }

    &[disabled] {
      box-shadow: none;
      color: #0086cc;

      &:hover,
      &:focus {
        background: #fff;
      }

      a {
        cursor: default;
      }
    }

    a {
      color: #0086cc;
    }
  }
}
</style>
