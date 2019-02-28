<template>
  <p class="area-date">
    {{ formattedUpdatedAt }}
  </p>
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
  font-size: 12px;
  margin: 0;
  align-self: flex-end;
}
</style>
