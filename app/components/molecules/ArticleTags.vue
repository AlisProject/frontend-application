<template>
  <div class="area-tags">
    <nuxt-link
      v-for="tag in tags"
      :to="`/tag/${tag}`"
      :key="tag"
      class="tag">
      <span class="tag-inner" @click="resetData">
        {{ tag }}
      </span>
    </nuxt-link>
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
    resetData() {
      this.resetTagArticlesData()
      this.setTagArticlesScrollHeight({ scrollHeight: 0 })
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
  background-color: rgba(0, 134, 204, 0.05);
  border-radius: 4px;
  color: #0086cc;
  cursor: pointer;
  display: inline-block;
  font-size: 12px;
  margin: 0 20px 20px 0;
  text-decoration: none;

  .tag-inner {
    display: inline-block;
    padding: 6px 8px;
  }
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
