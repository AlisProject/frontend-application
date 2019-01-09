<template>
  <p class="area-date">{{ formattedPublishedAt }}</p>
</template>

<script>
import { formatDate } from '~/utils/format'

export default {
  props: {
    publishedAt: {
      type: Number,
      required: true
    }
  },
  computed: {
    formattedPublishedAt() {
      return formatDate(this.publishedAt)
    }
  }
}
</script>

<style lang="scss" scoped>
.area-date {
  grid-area: date;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.8px;
  line-height: 1.5;
}
</style>
