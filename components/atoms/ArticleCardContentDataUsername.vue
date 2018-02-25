<template>
  <p class="area-name">{{ username }}</p>
</template>

<script>
export default {
  props: ['username']
}
</script>

<style lang="scss" scoped>
.area-name {
  align-self: flex-end;
  grid-area: name;
}
</style>
