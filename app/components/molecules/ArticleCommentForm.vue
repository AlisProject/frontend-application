<template>
  <div class="area-article-comment-form">
    <div class="article-comment-form-box">
      <no-ssr>
        <div class="comment-user" v-if="loggedIn">
          <img class="icon" :src="currentUserInfo.icon_image_url" v-if="currentUserInfo.icon_image_url !== undefined">
          <img class="icon" src="~assets/images/pc/common/icon_user_noimg.png" v-else>
          <span class="name">{{ currentUserInfo.user_display_name }}</span>
        </div>
      </no-ssr>
      <textarea
        class="comment-textarea"
        :class="{ 'no-border': !isCommentEmpty }"
        type="text"
        placeholder="コメントを入力してください"
        maxlength="400"
        @focus="checkLogin"
        v-model.trim="comment"/>
      <span
        class="comment-submit"
        :class="{ 'disable': isCommentEmpty }"
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
      comment: '',
      postingComment: false
    }
  },
  mounted() {
    const textarea = this.$el.querySelector('.comment-textarea')
    textarea.style.lineHeight = '18px'
    textarea.style.height = '60px'

    textarea.addEventListener('input', (event) => {
      if (event.target.scrollHeight > event.target.offsetHeight) {
        event.target.style.height = `${event.target.scrollHeight}px`
        return
      }
      let height, lineHeight
      while (true) {
        height = Number(event.target.style.height.split('px')[0])
        lineHeight = Number(event.target.style.lineHeight.split('px')[0])
        event.target.style.height = `${height - lineHeight}px`
        if (event.target.scrollHeight > event.target.offsetHeight) {
          event.target.style.height = `${event.target.scrollHeight}px`
          break
        }
      }
    })

    const viewportMeta = document.querySelector('meta[name="viewport"]')
    textarea.addEventListener('touchstart', (event) => {
      viewportMeta.setAttribute('content', 'width=device-width,initial-scale=1,user-scalable=0')
    })
    textarea.addEventListener('blur', (event) => {
      viewportMeta.setAttribute('content', 'width=device-width,initial-scale=1')
    })
  },
  computed: {
    isCommentEmpty() {
      return this.comment.length === 0
    },
    ...mapGetters('user', ['loggedIn', 'currentUserInfo'])
  },
  methods: {
    showModal() {
      this.setRequestLoginModal({ isShow: true, requestType: 'articleComment' })
      window.scrollTo(0, 0)
      document.querySelector('html').style.overflow = 'hidden'
      document.querySelector('body').style.overflow = 'hidden'
    },
    checkLogin() {
      if (this.loggedIn) return
      document.activeElement.blur()
      this.showModal()
    },
    async submit() {
      if (this.isCommentEmpty) return
      if (!this.loggedIn) {
        this.showModal()
        return
      }
      try {
        if (this.postingComment) return
        this.postingComment = true
        const escapedComment = this.escapeHTML(this.comment)
        const commentId = await this.postArticleComment({
          articleId: this.$route.params.articleId,
          text: escapedComment
        })
        this.addArticleComment({ text: escapedComment, commentId })
        this.sendNotification({ text: 'コメントを投稿しました。' })
        this.comment = ''
        this.$el.querySelector('.comment-textarea').focus()
      } catch (error) {
        console.error(error)
      } finally {
        this.postingComment = false
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
      align-items: center;
      color: #5b5b5b;
      display: flex;
      font-size: 14px;
      overflow: hidden;

      .icon {
        border-radius: 50%;
        height: 36px;
        margin-right: 16px;
        width: 36px;
      }

      .name {
        color: #6e6e6e;
        font-size: 12px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
    font-size: 12px;
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

    &.disable {
      color: #cecece;
      cursor: not-allowed;
      outline: none;
    }
  }
}

@media screen and (max-width: 640px) {
  .area-article-comment-form {
    padding: 40px 10px 8px;
  }
}
</style>
