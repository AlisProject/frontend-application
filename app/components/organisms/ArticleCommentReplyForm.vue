<template>
  <div class="area-article-comment-form">
    <div class="article-comment-reply-form-box">
      <no-ssr>
        <div class="comment-user" v-if="loggedIn">
          <img class="icon" :src="currentUserInfo.icon_image_url" v-if="currentUserInfo.icon_image_url !== undefined">
          <img class="icon" src="~assets/images/pc/common/icon_user_noimg.png" v-else>
          <div class="user-info-box">
            <span class="name">{{ decodedUserDisplayName }}</span>
            <span class="reply-target-user-name" v-if="isShowReplyTarget">
              返信先：{{ replyInfo.replyedUserDisplayName }}
            </span>
          </div>
        </div>
      </no-ssr>
      <textarea
        class="reply-comment-textarea"
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
        tabindex="0">返信する</span>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'
import { htmlDecode } from '~/utils/article'

export default {
  props: {
    replyInfo: {
      type: Object,
      required: true
    },
    isShowReplyTarget: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      comment: '',
      postingComment: false
    }
  },
  mounted() {
    const textarea = this.$el.querySelector('.reply-comment-textarea')
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
    decodedUserDisplayName() {
      return htmlDecode(this.currentUserInfo.user_display_name)
    },
    isCommentEmpty() {
      return this.comment.length === 0
    },
    ...mapGetters('user', ['loggedIn', 'currentUserInfo', 'currentUser'])
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
      } else {
        if (!this.currentUser.phoneNumberVerified) {
          this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'articleComment' })
          this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
          window.scrollTo(0, 0)
          document.querySelector('html').style.overflow = 'hidden'
          document.querySelector('body').style.overflow = 'hidden'
          return
        }
      }
      try {
        if (this.postingComment) return
        this.postingComment = true
        const escapedComment = this.escapeHTML(this.comment)
        const commentId = await this.postArticleReplyComment({
          articleId: this.$route.params.articleId,
          parentId: this.replyInfo.parentId,
          replyedUserId: this.replyInfo.replyedUserId,
          text: escapedComment
        })
        this.addArticleReplyComment({
          text: escapedComment,
          commentId,
          parentId: this.replyInfo.parentId,
          replyedUserId: this.replyInfo.replyedUserId,
          replyedUserDisplayName: this.replyInfo.replyedUserDisplayName
        })
        this.sendNotification({ text: 'コメントを投稿しました。' })
        this.comment = ''
        this.$el.querySelector('.reply-comment-textarea').focus()
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
    ...mapActions('article', ['postArticleReplyComment', 'addArticleReplyComment']),
    ...mapActions('user', [
      'setRequestLoginModal',
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.area-article-comment-form {
  background-color: #fff;
  grid-area: article-comment-form;
  padding: 0 calc(50% - 324px) 0 74px;

  .article-comment-reply-form-box {
    border-top: 1px solid rgb(240, 240, 240);
    background-color: #fff;
    border-radius: 4px;
    padding: 24px 24px 24px 0;

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

      .user-info-box {
        display: flex;
        flex-direction: column;
        line-height: 1.6;

        .name {
          color: #6e6e6e;
          font-size: 12px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .reply-target-user-name {
          color: #858dda;
          font-size: 10px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .reply-comment-textarea {
    -webkit-appearance: none;
    border-radius: 0;
    border: none;
    border: 1px dotted #232538;
    font-family: YuGothic, 'Helvetica Neue', Helvetica, Arial, 游ゴシック体, '游ゴシック',
      'ヒラギノ角ゴ ProN W3', 'Hiragino Kaku Gothic ProN', 'ヒラギノ角ゴ Pro W3',
      'Hiragino Kaku Gothic Pro', 'メイリオ', Meiryo, 'MS ゴシック', 'MS Gothic', sans-serif;
    font-size: 12px;
    height: 4em;
    margin: 4px 0 8px 46px;
    overflow: hidden;
    padding: 5px;
    resize: none;
    width: calc(100% - 50px);
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

@media screen and (max-width: 530px) {
  .area-article-comment-form {
    width: calc(100vw - 94px);
  }
}
</style>
