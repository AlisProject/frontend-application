<template>
  <span class="nav-link post-article" :class="{ disable: !publishable }" @click="onClick">
    公開する
  </span>
</template>

<script>
export default {
  props: {
    publishable: Boolean,
    onClick: Function
  }
}
</script>

<style lang="scss" scoped>
.post-article {
  color: #858dda;
  cursor: pointer;
  user-select: none;
  display: inline-block;

  &.disable {
    cursor: not-allowed;
  }
}
</style>
