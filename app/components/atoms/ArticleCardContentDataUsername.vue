<template>
  <p class="area-name">{{ username }}</p>
</template>

<script>
export default {
  props: {
    username: {
      type: String,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
.area-name {
  align-self: flex-end;
  grid-area: name;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
