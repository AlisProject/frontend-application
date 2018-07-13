<template>
  <div class="area-article-comment-form">
    <div class="article-comment-form-box">
      <no-ssr>
        <div class="comment-user" v-if="loggedIn">
          <img class="icon" :src="currentUserInfo.icon_image_url" v-if="currentUserInfo.icon_image_url !== undefined">
          <img class="icon" src="~assets/images/pc/common/icon_user_noimg.png" v-else>
          <ul class="info">
            <li class="info-content">{{ currentUserInfo.user_display_name }}</li>
          </ul>
        </div>
      </no-ssr>
      <textarea
        class="comment-textarea"
        :class="{ 'no-border': comment.length !== 0 }"
        type="text"
        placeholder="コメントを入力してください"
        maxlength="400"
        @focus="checkLogin"
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
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  data() {
    return {
      comment: ''
    }
  },
  computed: {
    ...mapGetters('user', ['loggedIn', 'currentUserInfo'])
  },
  methods: {
    showModal() {
      this.setRequestLoginModal({ isShow: true, requestType: 'articleComment' })
      window.scrollTo(0, 0)
      document.querySelector('html,body').style.overflow = 'hidden'
    },
    checkLogin() {
      if (this.loggedIn) return
      this.showModal()
    },
    async submit() {
      if (!this.loggedIn) {
        this.showModal()
        return
      }
      try {
        const commentId = await this.postArticleComment({
          articleId: this.$route.params.articleId,
          comment: this.escapeHTML(this.comment)
        })
        this.addArticleComment({ text: this.comment, commentId })
        this.sendNotification({ text: 'コメントを投稿しました。' })
        this.comment = ''
        this.$el.querySelector('.comment-textarea').focus()
      } catch (error) {
        console.error(error)
      }
    },
    escapeHTML(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', ['postArticleComment', 'addArticleComment']),
    ...mapActions('user', ['setRequestLoginModal'])
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

    .comment-user {
      color: #5b5b5b;
      font-size: 14px;

      .info {
        color: #6e6e6e;
        float: left;
        font-size: 12px;
        list-style: none;
        margin: 8px 16px;
        padding: 0;

        .info-content {
          line-height: 1.5;
        }
      }

      .icon {
        float: left;
        width: 36px;
        height: 36px;
        border-radius: 50%;
      }
    }
  }

  .comment-textarea {
    -webkit-appearance: none;
    border-radius: 0;
    border: none;
    border: 1px dotted #232538;
    font-family: YuGothic, 'Helvetica Neue', Helvetica, Arial, 游ゴシック体, '游ゴシック',
      'ヒラギノ角ゴ ProN W3', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ Pro W3',
      'Hiragino Kaku Gothic Pro', 'メイリオ', Meiryo, 'MS ゴシック', 'MS Gothic', sans-serif;
    height: 4em;
    margin: 14px 0 8px;
    overflow: hidden;
    padding: 5px;
    resize: none;
    width: 100%;
    box-sizing: border-box;

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
