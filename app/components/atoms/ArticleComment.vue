<template>
  <div class="article-comment" ref="comment">
    <div class="commented-user">
      <img class="icon" :src="comment.userInfo.icon_image_url" v-if="comment.userInfo.icon_image_url !== undefined">
      <img class="icon" src="~assets/images/pc/common/icon_user_noimg.png" v-else>
      <ul class="info">
        <li class="info-content">{{ comment.userInfo.user_display_name }}</li>
        <li class="info-content">{{ createdAt }}</li>
      </ul>
    </div>
    <p class="body">{{ comment.text }}</p>
    <div class="action-like" @click="like">{{ comment.isLiked || isLiked ? 'いいねした' : 'いいね' }}</div>
    <div class="action-delete" @click="deleteComment" v-if="showDeleteAction">削除</div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { formatDateFromNow } from '~/utils/format'

export default {
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isLiked: false
    }
  },
  computed: {
    createdAt() {
      return formatDateFromNow(this.comment.created_at)
    },
    showDeleteAction() {
      return (
        this.comment.user_id === this.currentUserInfo.user_id ||
        this.currentUserInfo.user_id === this.article.user_id
      )
    },
    ...mapGetters('user', ['currentUserInfo']),
    ...mapGetters('article', ['article'])
  },
  methods: {
    async like() {
      await this.postCommentLike({ commentId: this.comment.comment_id })
      this.isLiked = true
    },
    async deleteComment(event) {
      try {
        await this.deleteArticleComment({ commentId: this.comment.comment_id })
        const { comment } = this.$refs
        comment.parentNode.removeChild(comment)
      } catch (error) {
        console.error(error)
        if (error.response.data.message === 'Record Not Found') {
          this.sendNotification({
            text: 'コメントはすでに削除されています。削除が反映されるまで今しばらくお待ち下さい。',
            type: 'warning'
          })
        }
      }
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', ['postCommentLike', 'deleteArticleComment'])
  }
}
</script>

<style lang="scss" scoped>
.article-comment {
  background-color: #fff;
  border-radius: 4px;
  padding: 24px;
  position: relative;

  .commented-user {
    color: #5b5b5b;
    font-size: 14px;
    left: 20px;
    position: absolute;
    top: 20px;

    .info {
      color: #6e6e6e;
      float: right;
      font-size: 12px;
      list-style: none;
      margin: 0px 16px;
      padding: 0;

      .info-content {
        line-height: 1.5;
      }
    }

    .icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }
  }

  .body {
    color: #030303;
    font-size: 12px;
    font-weight: 500;
    line-height: 1.8;
    margin-top: 40px;
    padding-bottom: 40px;
    word-break: break-word;
  }

  .action-like {
    bottom: 20px;
    position: absolute;
    left: 24px;
    cursor: pointer;
  }

  .action-delete {
    bottom: 20px;
    position: absolute;
    right: 24px;
    cursor: pointer;
  }
}
</style>
