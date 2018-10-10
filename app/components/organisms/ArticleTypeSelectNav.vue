<template>
  <div class="area-article-type-select-nav">
    <nuxt-link
      class="nav-link"
      :class="{ 'selected': isPopularArticles }"
      :to="moveToPoplarArticles">
      人気記事
    </nuxt-link>
    <nuxt-link
      class="nav-link"
      :class="{ 'selected': isNewArticles }"
      :to="moveToNewArticles">
      新着記事
    </nuxt-link>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  computed: {
    moveToPoplarArticles() {
      const { fullPath } = this.$route
      this.setArticleType({ articleType: 'popularArticles' })
      const to = fullPath.replace('recent', 'popular')
      return to
    },
    moveToNewArticles() {
      const { fullPath } = this.$route
      this.setArticleType({ articleType: 'newArticles' })
      const to = fullPath.replace('popular', 'recent')
      return to
    },
    isPopularArticles() {
      return this.articleType === 'popularArticles'
    },
    isNewArticles() {
      return this.articleType === 'newArticles'
    },
    ...mapGetters('article', ['topics', 'articleType'])
  },
  methods: {
    ...mapActions('article', ['setArticleType'])
  }
}
</script>

<style lang="scss" scoped>
.area-article-type-select-nav {
  grid-area: article-type-select-nav;
  display: flex;
  align-self: center;
  justify-self: center;
}

.nav-link {
  color: #6e6e6e;
  font-size: 12px;
  letter-spacing: 0.8px;
  margin: 14px;
  padding: 4px 12px;
  text-decoration: none;

  &.selected {
    border-radius: 10px;
    background-color: #858dda;
    color: #fff;
  }
}
</style>
