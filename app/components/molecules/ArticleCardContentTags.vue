<template>
  <span class="area-tags">
    <nuxt-link
      v-for="tag in tags"
      :to="`/tag/${tag}`"
      :key="tag"
      class="tag">
      {{ tag }}
    </nuxt-link>
  </span>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      required: false
    }
  }
}
</script>

<style lang="scss" scoped>
.area-tags {
  grid-area: tags;
  -webkit-box-orient: vertical;
  color: #7f7f7f;
  display: -webkit-box;
  font-size: 12px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag {
  background-color: rgba(110, 110, 110, 0.08);
  border-radius: 2px;
  color: #6e6e6e;
  display: inline-block;
  font-size: 11px;
  line-height: 15px;
  margin: 0 6px 6px 0;
  padding: 1px 4px;
  text-decoration: none;
  transition: color 400ms ease;
  white-space: nowrap;
}
</style>
