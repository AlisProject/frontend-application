<template>
  <p class="area-date">{{ formettedCreatedAt }}</p>
</template>

<script>
export default {
  props: ['createdAt'],
  computed: {
    formettedCreatedAt() {
      return new Date(this.createdAt).toLocaleDateString('ja')
    }
  }
}
</script>

<style lang="scss" scoped>
.area-date {
  grid-area: date;
}
</style>
