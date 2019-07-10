<template>
  <span class="area-date">
    {{ formattedUpdatedAt }}
  </span>
</template>

<script>
import { formatDateWithTime } from '~/utils/format'

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
  font-size: 16px;
  margin: 5px;
  align-self: flex-start;
}
</style>
