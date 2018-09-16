<template>
  <p class="area-name">{{ decodedUsername }}</p>
</template>

<script>
import { htmlDecode } from '~/utils/article'

export default {
  props: {
    username: {
      type: String,
      required: false
    }
  },
  computed: {
    decodedUsername() {
      return htmlDecode(this.username)
    }
  }
}
</script>

<style lang="scss" scoped>
.area-name {
  align-self: flex-end;
  grid-area: name;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
