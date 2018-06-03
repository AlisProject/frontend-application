<template>
  <p class="area-date">{{ formattedCreatedAt }}</p>
</template>

<script>
import { formatDate } from '~/utils/article'

export default {
  props: {
    createdAt: {
      type: Number,
      required: true
    }
  },
  computed: {
    formattedCreatedAt() {
      return formatDate(this.createdAt)
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
