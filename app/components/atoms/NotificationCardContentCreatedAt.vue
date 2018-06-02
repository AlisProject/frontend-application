<template>
  <p class="area-date">{{ formattedCreatedAt }}</p>
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
    formattedCreatedAt() {
      return moment(this.createdAt, 'X')
        .locale('ja')
        .format('L')
    }
  }
}
</script>

<style lang="scss" scoped>
.area-date {
  color: #7f7f7f;
  font-size: 14px;
  margin: 0;
}
</style>
