<template>
  <div class="area-article-comments">
    <span
      class="read-more-button"
      @click="showComments"
      v-if="hasArticleCommentsLastEvaluatedKey">前のコメントを表示</span>
    <article-comment v-for="comment in comments" :comment="comment" :key="comment.comment_id"/>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ArticleComment from '../atoms/ArticleComment'

export default {
  components: {
    ArticleComment
  },
  data() {
    return {
      loadingComments: false
    }
  },
  props: {
    comments: {
      type: Array,
      required: true
    }
  },
  computed: {
    ...mapGetters('user', ['loggedIn']),
    ...mapGetters('article', ['hasArticleCommentsLastEvaluatedKey'])
  },
  methods: {
    async showComments() {
      if (this.loadingComments) return
      try {
        this.loadingComments = true
        await this.setArticleComments({ articleId: this.$route.params.articleId })
        document.activeElement.blur()
      } catch (error) {
        console.error(error)
      } finally {
        this.loadingComments = false
      }
    },
    ...mapActions('article', ['setArticleComments'])
  }
}
</script>

<style lang="scss" scoped>
.area-article-comments {
  background-color: rgba(35, 37, 56, 0.05);
  display: grid;
  grid-area: article-comments;
  grid-gap: 8px;
  padding: 20px calc(50% - 324px) 8px;
}

.read-more-button {
  color: #6e6e6e;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  margin: 20px 0 20px;
}

@media screen and (max-width: 640px) {
  .area-article-comments {
    padding: 40px 10px 48px;
  }
}
</style>
