<template>
  <div class="area-article-comment-reply-comments">
    <article-comment-reply-comment
      v-for="replyComment in replies"
      :key="replyComment.comment_id"
      :reply-comment="replyComment"
      :article-comment-reply-form-box-position="articleCommentReplyFormBoxPosition"
      :reply-info="replyInfo"
      @handle-reply="handleReply"
    />
  </div>
</template>

<script>
import ArticleCommentReplyComment from '../organisms/ArticleCommentReplyComment'

export default {
  components: {
    ArticleCommentReplyComment
  },
  props: {
    replies: {
      type: Array,
      required: true
    },
    articleCommentReplyFormBoxPosition: {
      type: Number,
      required: true
    },
    replyInfo: {
      type: Object,
      required: true
    }
  },
  methods: {
    handleReply(replyInfo, isShowReplyTarget) {
      this.$emit('handle-reply', replyInfo, isShowReplyTarget)
    }
  }
}
</script>

<style lang="scss" scoped>
.area-article-comment-reply-comments {
  background: #fff;
  display: flex;
  flex-flow: column-reverse nowrap;
  padding: 0 0 0 74px;
}
</style>
