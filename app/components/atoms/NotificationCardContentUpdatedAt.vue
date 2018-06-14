<template>
  <p class="area-date">{{ formattedUpdatedAt }}</p>
</template>

<script>
import { formatDateWithTime } from '~/utils/article'

export default {
  props: {
    updatedAt: {
      type: Number,
      required: true
    }
  },
  computed: {
    formattedUpdatedAt() {
      return formatDateWithTime(this.updatedAt)
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

@media screen and (max-width: 640px) {
  .area-date {
    font-size: 12px;
  }
}
</style>
