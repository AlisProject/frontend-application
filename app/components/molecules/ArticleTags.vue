<template>
  <div class="area-tags">
    <span
      v-for="tag in tags"
      :key="tag"
      @click="onClick(tag)"
      class="tag">
      {{ tag }}
    </span>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    tags: {
      type: Array,
      required: false
    }
  },
  methods: {
    onClick(value) {
      this.resetTagArticlesData()
      this.setTagArticlesScrollHeight({ scrollHeight: 0 })
      this.$router.push(`/tag/${value}`)
    },
    ...mapActions('article', ['resetTagArticlesData']),
    ...mapActions('presentation', ['setTagArticlesScrollHeight'])
  }
}
</script>

<style lang="scss" scoped>
.area-tags {
  grid-area: tags;
  margin-bottom: -10px;
}

.tag {
  background-color: rgba(133, 141, 218, 0.05);
  border-radius: 4px;
  color: #858dda;
  cursor: pointer;
  display: inline-block;
  font-size: 12px;
  margin: 0 20px 20px 0;
  padding: 6px 8px;
  text-decoration: none;
}

@media screen and (max-width: 640px) {
  .area-tags {
    margin-bottom: 0;
  }

  .tag {
    margin: 0 10px 10px 0;
  }
}
</style>
