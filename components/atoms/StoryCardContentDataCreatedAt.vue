<template>
  <p class="area-date">{{ createdAt }}</p>
</template>

<script>
export default {
  props: ['createdAt']
}
</script>

<style lang="scss" scoped>
.area-date {
  grid-area: date;
}
</style>
