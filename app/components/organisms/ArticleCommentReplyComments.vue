<template>
  <div class="area-article-comment-reply-comments">
    <article-comment-reply-comment
      v-for="replyComment in replyComments"
      :replyComment="replyComment"
      :articleCommentReplyFormBoxPosition="articleCommentReplyFormBoxPosition"
      @handle-reply="handleReply"
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
    },
    articleCommentReplyFormBoxPosition: {
      type: Number,
      required: true
    }
  },
  components: {
    ArticleCommentReplyComment
  },
  methods: {
    handleReply(replyInfo) {
      this.$emit('handle-reply', replyInfo)
    }
  }
}
</script>

<style lang="scss" scoped>
.area-article-comment-reply-comments {
  background: #fff;
  padding: 0 0 0 74px;
}
</style>
