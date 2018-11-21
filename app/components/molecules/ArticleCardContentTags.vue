<template>
  <span class="area-tags">
    <nuxt-link
      v-for="tag in tags"
      :to="`/tag/${tag}`"
      :key="tag"
      class="tag">
      #{{ tag }}
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
  -webkit-line-clamp: 2;
  color: #7f7f7f;
  display: -webkit-box;
  font-size: 12px;
  line-height: 1.5;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tag {
  color: #6e6e6e;
  display: inline-block;
  font-size: 10px;
  line-height: 1.5;
  margin-right: 8px;
  text-decoration: none;
  transition: color 400ms ease;

  &:hover {
    color: #0086cc;
  }
}
</style>
