<template>
  <p class="area-date">{{ formettedPublishedAt }}</p>
</template>

<script>
import { formatDate } from '~/utils/article'

export default {
  props: {
    publishedAt: {
      type: Number,
      required: true
    }
  },
  computed: {
    formettedPublishedAt() {
      return formatDate(this.publishedAt)
    }
  }
}
</script>

<style lang="scss" scoped>
.area-date {
  grid-area: date;
}
</style>
