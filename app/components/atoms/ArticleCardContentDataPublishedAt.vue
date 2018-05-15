<template>
  <p class="area-date">{{ formettedPublishedAt }}</p>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    publishedAt: {
      type: Number,
      required: true
    }
  },
  computed: {
    formettedPublishedAt() {
      return moment(this.publishedAt, 'X')
        .locale('ja')
        .format('L')
    }
  }
}
</script>

<style lang="scss" scoped>
.area-date {
  grid-area: date;
}
</style>
