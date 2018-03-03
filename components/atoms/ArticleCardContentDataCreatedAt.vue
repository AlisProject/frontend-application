<template>
  <p class="area-date">{{ formettedCreatedAt }}</p>
</template>

<script>
import moment from 'moment'

export default {
  props: ['createdAt'],
  computed: {
    formettedCreatedAt() {
      return moment(this.created_at)
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
