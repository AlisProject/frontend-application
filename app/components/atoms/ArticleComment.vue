<template>
  <div class="article-comment">
    <div class="commented-user">
      <img class="icon" :src="comment.userInfo.icon_image_url" v-if="comment.userInfo.icon_image_url !== undefined">
      <img class="icon" src="~assets/images/pc/common/icon_user_noimg.png" v-else>
      <ul class="info">
        <li class="info-content">{{ comment.userInfo.user_display_name }}</li>
        <li class="info-content">{{ createdAt }}</li>
      </ul>
    </div>
    <p class="body">{{ comment.text }}</p>
    <div class="action-like" @click="like">いいね</div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { formatDateFromNow } from '~/utils/format'

export default {
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  computed: {
    createdAt() {
      return formatDateFromNow(this.comment.created_at)
    }
  },
  methods: {
    async like() {
      await this.postCommentLike({ commentId: this.comment.comment_id })
    },
    ...mapActions('article', ['postCommentLike'])
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
}
</style>
