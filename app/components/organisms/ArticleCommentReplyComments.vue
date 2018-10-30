<template>
  <div class="area-article-comment-reply-comments">
    <article-comment-reply-comment
      v-for="replyComment in replies"
      :replyComment="replyComment"
      :articleCommentReplyFormBoxPosition="articleCommentReplyFormBoxPosition"
      @handle-reply="handleReply"
      :replyInfo="replyInfo"
      :key="replyComment.comment_id" />
  </div>
</template>

<script>
import ArticleCommentReplyComment from '../organisms/ArticleCommentReplyComment'

export default {
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
  components: {
    ArticleCommentReplyComment
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
  padding: 0 0 0 74px;
}
</style>
