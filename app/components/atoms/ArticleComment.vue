<template>
  <div class="article-comment">
    <div class="commented-user">
      <img class="icon" :src="comment.userInfo.icon_image_url">
      <ul class="info">
        <li class="info-content">{{ comment.userInfo.user_display_name }}</li>
        <li class="info-content">{{ createdAt }}</li>
      </ul>
    </div>
    <p class="body">{{ comment.text }}</p>
    <div class="action-like"></div>
  </div>
</template>

<script>
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
    background: url('~assets/images/pc/article/icon_heart.png') no-repeat;
    background-color: #ff4949;
    background-size: 18px;
    background-position: 9px 11px;
    border-radius: 50%;
    border: 1px solid #ff4949;
    bottom: 20px;
    box-shadow: 0px 5px 15px -1px #ff8989;
    height: 35px;
    position: absolute;
    right: 24px;
    width: 35px;
  }
}

@media screen and (max-width: 640px) {
  .article-comment {
    .action-like {
      background-size: 16px;
      background-position: 7px 10px;
      bottom: 16px;
      height: 30px;
      right: 16px;
      width: 30px;
    }
  }
}
</style>
