<template>
  <h2 class="area-title">
    {{ decodedTitle }}
  </h2>
</template>

<script>
import { htmlDecode } from '~/utils/article'

export default {
  props: {
    title: {
      type: String,
      required: false
    }
  },
  computed: {
    decodedTitle() {
      return htmlDecode(this.title)
    }
  }
}
</script>

<style lang="scss" scoped>
.area-title {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #555;
  display: -webkit-box;
  font-size: 14px;
  font-weight: bold;
  grid-area: title;
  letter-spacing: 0.8px;
  line-height: 1.714;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;

  a {
    color: #3f3f3f;
    display: block;
    text-decoration: none;
  }
}
</style>
