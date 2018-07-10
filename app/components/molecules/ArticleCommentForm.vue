<template>
  <div class="area-article-comment-form">
    <div class="article-comment-form-box">
      <div class="comment-user">
        <img class="icon" :src="currentUserInfo.icon_image_url" v-if="currentUserInfo.icon_image_url !== undefined">
        <img class="icon" src="~assets/images/pc/common/icon_user_noimg.png" v-else>
        <ul class="info">
          <li class="info-content">{{ currentUserInfo.user_display_name }}</li>
        </ul>
      </div>
      <textarea
        class="comment-textarea"
        :class="{ 'no-border': comment.length !== 0 }"
        type="text"
        placeholder="コメントを入力してください"
        maxlength="400"
        v-model="comment"/>
      <span
        class="comment-submit"
        @click="submit"
        @keypress.enter="submit"
        tabindex="0">コメントする</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  data() {
    return {
      comment: ''
    }
  },
  computed: {
    ...mapGetters('user', ['currentUserInfo'])
  },
  methods: {
    async submit() {
      try {
        await this.postArticleComment({
          articleId: this.$route.params.articleId,
          comment: this.comment
        })
      } catch (error) {
        console.error(error)
      }
    },
    ...mapActions('article', ['postArticleComment'])
  }
}
</script>

<style lang="scss" scoped>
.area-article-comment-form {
  grid-area: article-comment-form;
  background-color: rgba(35, 37, 56, 0.05);
  padding: 40px calc(50% - 324px) 8px;

  .article-comment-form-box {
    background-color: #fff;
    border-radius: 4px;
    padding: 24px;
    position: relative;

    .comment-user {
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
        margin: 8px 16px;
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
  }

  .comment-textarea {
    border-radius: 0;
    border: none;
    border: 1px dotted #232538;
    font-family: YuGothic;
    height: 4em;
    margin: 44px 0 8px;
    overflow: hidden;
    padding: 5px;
    resize: none;
    width: 100%;

    &.no-border {
      border: none;
    }

    &::-webkit-input-placeholder {
      color: #cecece;
      font-size: 14px;
      letter-spacing: 0.05em;
    }

    &:focus {
      border: none;
      outline: 0;
    }
  }

  .comment-submit {
    color: #858dda;
    cursor: pointer;
    float: right;
    font-size: 12px;
  }
}

@media screen and (max-width: 640px) {
  .area-article-comment-form {
    padding: 40px 10px 8px;
  }
}
</style>
