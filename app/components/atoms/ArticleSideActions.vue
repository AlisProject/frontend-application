<template>
  <transition name="fade">
    <div v-show="scrollY > 300" class="article-side-actions">
      <div class="action like" :class="{ liked: isLikedArticle }" @click="like">
        <span class="likes-count" @click.stop>{{ formattedLikesCount }}</span>
      </div>
      <a class="sub-action area-share-twitter" target="_blank" />
      <a class="sub-action area-share-facebook" target="_blank" />
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  props: {
    articleId: {
      type: String,
      required: true
    },
    likesCount: {
      type: Number,
      required: true
    },
    isLikedArticle: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      scrollY: 0,
      isSharePopupShown: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.$el.querySelector(
      '.area-share-twitter'
    ).href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      location.href
    )}&text=${encodeURIComponent(`${this.article.title} | ALIS`)}`

    this.$el.querySelector(
      '.area-share-facebook'
    ).href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`
  },
  computed: {
    formattedLikesCount() {
      return this.likesCount > 999 ? (this.likesCount / 1000).toFixed(1) + 'k' : this.likesCount
    },
    ...mapGetters('user', ['loggedIn', 'currentUser', 'currentUserInfo']),
    ...mapGetters('article', ['article'])
  },
  methods: {
    handleScroll() {
      this.scrollY = window.scrollY
    },
    async like() {
      if (this.loggedIn) {
        if (this.isLikedArticle) return
        if (!this.currentUser.phoneNumberVerified) {
          this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'articleLike' })
          this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
          return
        }
        const encryptInfo = await this.getWalletEncryptInfo()
        if (!encryptInfo.encrypted_secret_key) {
          this.setRequestWalletPasswordModal({ isShow: true })
          this.setRequestInputWalletPasswordModal({ isShow: true })
          return
        }
        try {
          await this.postLike({ articleId: this.articleId })
          await this.getIsLikedArticle({ articleId: this.articleId })
        } catch (error) {
          this.sendNotification({
            text: 'エラーが発生しました。しばらく時間を置いて再度お試しください',
            type: 'warning'
          })
        }
        if (!this.currentUserInfo.is_liked_article) {
          this.setFirstProcessModal({ isShow: true })
          this.setFirstProcessLikedArticleModal({ isShow: true })
        }
      } else {
        this.setRequestLoginModal({ isShow: true, requestType: 'articleLike' })
      }
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', ['postLike', 'getIsLikedArticle']),
    ...mapActions('user', [
      'setRequestLoginModal',
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal',
      'setRequestWalletPasswordModal',
      'setRequestInputWalletPasswordModal',
      'setFirstProcessModal',
      'setFirstProcessLikedArticleModal',
      'getWalletEncryptInfo',
      'setRequestWalletPasswordModal',
      'setRequestInputWalletPasswordModal'
    ])
  }
}
</script>

<style lang="scss" scoped>
.article-side-actions {
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  position: fixed;
  left: calc(50% - 450px);

  .action {
    width: 52px;
    height: 52px;
  }

  .sub-action {
    height: 40px;
    width: 40px;
  }

  .like {
    background: #fff url('~assets/images/pc/article/icon_like.png') no-repeat;
    background-position: 9px;
    background-size: 32px;
    border-radius: 50%;
    border: 1px solid #ff4949;
    box-shadow: 0px 2px 15px -1px #ff4949;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;
    margin-bottom: 20px;

    .likes-count {
      align-items: center;
      background-color: #fff;
      border-radius: 50%;
      border: 1px solid #ff4949;
      color: #ff4949;
      cursor: auto;
      display: flex;
      font-size: 12px;
      height: 24px;
      justify-content: center;
      position: absolute;
      right: 12px;
      top: -36px;
      width: 24px;
    }

    &.liked {
      background: #ff4949 url('~assets/images/pc/article/icon_like_selected.png') no-repeat;
      background-position: 9px;
      background-size: 32px;
      border-radius: 50%;
      cursor: not-allowed;
      position: relative;

      .likes-count {
        background-color: #ff4949;
        color: #fff;
      }
    }
  }

  .area-share-twitter {
    grid-area: share-twitter;
    background: #fff url('~assets/images/pc/article/icon_share_twitter.png') no-repeat;
    background-position-x: 9px;
    background-position-y: 9px;
    margin-bottom: 20px;
  }

  .area-share-facebook {
    grid-area: share-facebook;
    background: #fff url('~assets/images/pc/article/icon_share_facebook.png') no-repeat;
    background-position: 8px;
  }

  .area-share-twitter,
  .area-share-facebook {
    background-size: 24px;
    border-radius: 50%;
    box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.25);
    position: relative;
    cursor: pointer;
  }
}

.fade {
  &-enter-active,
  &-leave-active {
    transition: opacity 0.3s;
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }
}

@media screen and (max-width: 920px) {
  .article-side-actions {
    display: none;
  }
}
</style>
