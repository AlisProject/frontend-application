<template>
  <p class="area-date">{{ formettedCreatedAt }}</p>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    createdAt: {
      type: Number,
      required: true
    }
  },
  computed: {
    formettedCreatedAt() {
      return moment(this.createdAt, 'X')
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
