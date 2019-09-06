<template>
  <div id="article-comments" class="area-article-comments">
    <div class="area-header-contents">
      <span class="to-comment-button" @click="moveToBottom">コメントする</span>
      <the-loader :is-loading="!article.initComment" class="comment-loader" />
      <span
        v-if="hasArticleCommentsLastEvaluatedKey"
        class="read-more-button"
        @click="showComments"
      >前のコメントを表示</span>
    </div>
    <div class="article-comments">
      <article-comment v-for="comment in comments" :key="comment.comment_id" :comment="comment" />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import ArticleComment from '../atoms/ArticleComment'
import TheLoader from '../atoms/TheLoader'

export default {
  components: {
    ArticleComment,
    TheLoader
  },
  props: {
    comments: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      loadingComments: false
    }
  },
  computed: {
    ...mapGetters('user', ['loggedIn', 'currentUser']),
    ...mapGetters('article', ['hasArticleCommentsLastEvaluatedKey', 'article'])
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
    moveToBottom() {
      if (!this.loggedIn) {
        this.setRequestLoginModal({ isShow: true, requestType: 'articleComment' })
        return
      } else if (!this.currentUser.phoneNumberVerified) {
        this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'articleComment' })
        this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
        return
      }

      if (!document.querySelector('.article-comment-form-box')) {
        return
      }
      const articleCommentFormBoxPosition =
        document.querySelector('.article-comment-form-box').getBoundingClientRect().top +
        window.pageYOffset
      window.scroll({
        top: articleCommentFormBoxPosition,
        behavior: 'smooth'
      })
    },
    ...mapActions('article', ['setArticleComments']),
    ...mapActions('user', [
      'setRequestLoginModal',
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.area-article-comments {
  background-color: rgba(35, 37, 56, 0.05);
  display: grid;
  grid-area: article-comments;
  padding: 8px calc(50% - 324px) 8px;
}

.area-header-contents {
  display: grid;
  grid-template-columns: 110px 1fr 75px;
  /* prettier-ignore */
  grid-template-areas:
    'read-more           loader           to-comment';
}

.read-more-button {
  grid-area: read-more;
  color: #6e6e6e;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  padding: 32px 0px 20px;
}

.to-comment-button {
  grid-area: to-comment;
  color: #0086cc;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  padding: 32px 0px 20px;
}

.article-comments {
  display: flex;
  flex-flow: column-reverse nowrap;
}

@media screen and (max-width: 640px) {
  .area-article-comments {
    padding: 8px 10px 8px;
  }
}
</style>
