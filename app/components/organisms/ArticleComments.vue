<template>
  <div class="area-article-comments" :class="{ 'without-top-space': !showTopSpace }">
    <article-comment v-for="comment in comments" :comment="comment" :key="comment.comment_id"/>
    <app-button
      class="read-more-button"
      @click="showComments"
      v-if="hasArticleCommentsLastEvaluatedKey">もっと見る</app-button>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ArticleComment from '../atoms/ArticleComment'
import AppButton from '../atoms/AppButton'

export default {
  components: {
    ArticleComment,
    AppButton
  },
  data() {
    return {
      showTopSpace: false,
      loadingComments: false
    }
  },
  props: {
    comments: {
      type: Array,
      required: true
    }
  },
  mounted() {
    this.showTopSpace = !this.loggedIn
    this.showTopSpace = this.comments.lenth === 0
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
  padding: 40px calc(50% - 324px) 48px;

  &.without-top-space {
    padding-top: 0;
  }
}

.read-more-button {
  margin: 40px auto 0;
}

@media screen and (max-width: 640px) {
  .area-article-comments {
    padding: 40px 10px 48px;
  }
}
</style>
