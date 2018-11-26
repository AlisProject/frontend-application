<template>
  <div class="area-article-comments" id="article-comments">
    <div class="header-contents">
      <span class="to-comment-button" @click="moveToBottom">コメントする</span>
      <span
        class="read-more-button"
        @click="showComments"
        v-if="hasArticleCommentsLastEvaluatedKey">前のコメントを表示</span>
    </div>
    <div class="article-comments">
      <article-comment v-for="comment in comments" :comment="comment" :key="comment.comment_id"/>
    </div>
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
    ...mapGetters('user', ['loggedIn', 'currentUser']),
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
    moveToBottom() {
      if (!this.loggedIn) {
        this.setRequestLoginModal({ isShow: true, requestType: 'articleComment' })
        return
      } else {
        if (!this.currentUser.phoneNumberVerified) {
          this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'articleComment' })
          this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
          return
        }
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
  padding: 20px calc(50% - 324px) 8px;
}

.header-contents {
  display: flex;
  justify-content: space-between;
  flex-direction: row-reverse;
  padding: 20px 0 20px;
}

.read-more-button {
  color: #6e6e6e;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.to-comment-button {
  color: #0086cc;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
}

.article-comments {
  display: flex;
  flex-flow: column-reverse nowrap;
}

@media screen and (max-width: 640px) {
  .area-article-comments {
    padding: 20px 10px 8px;
  }
}
</style>
