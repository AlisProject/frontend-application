<template>
  <div class="area-article-comment-reply-comments">
    <article-comment-reply-comment
      v-for="replyComment in replyComments"
      :replyComment="replyComment"
      :key="replyComment.comment_id" />
    <article-comment-reply-form />
  </div>
</template>

<script>
import ArticleCommentReplyComment from '../organisms/ArticleCommentReplyComment'
import ArticleCommentReplyForm from '../organisms/ArticleCommentReplyForm'

export default {
  props: {
    replyComments: {
      type: Array,
      required: true
    }
  },
  components: {
    ArticleCommentReplyComment,
    ArticleCommentReplyForm
  }
}
</script>

<style lang="scss" scoped>
.area-article-comment-reply-comments {
  background: #fff;
  padding: 0 0 0 74px;
}
</style>
