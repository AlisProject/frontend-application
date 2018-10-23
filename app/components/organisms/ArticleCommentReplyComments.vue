<template>
  <div class="area-article-comment-reply-comments">
    <article-comment-reply-comment
      v-for="replyComment in replyComments"
      :replyComment="replyComment"
      :key="replyComment.comment_id" />
  </div>
</template>

<script>
import ArticleCommentReplyComment from '../organisms/ArticleCommentReplyComment'

export default {
  props: {
    replyComments: {
      type: Array,
      required: true
    }
  },
  components: {
    ArticleCommentReplyComment
  }
}
</script>

<style lang="scss" scoped>
.area-article-comment-reply-comments {
  background: #fff;
  padding: 0 0 0 74px;
}
</style>
