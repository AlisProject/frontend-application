<template>
  <div :class="[isMyArticle ? 'area-footer-actions-own' : 'area-footer-actions']">
    <div class="action area-like" :class="{ liked: isLikedArticle }" @click="like">
      <span class="likes-count" @click.stop>{{ formattedLikesCount }}</span>
    </div>
    <no-ssr>
      <div v-if="!isMyArticle" class="action area-tip" @click="tip" />
    </no-ssr>
    <a class="sub-action area-share-twitter" target="_blank" />
    <a class="sub-action area-share-facebook" target="_blank" />
    <no-ssr>
      <div v-if="!isMyArticle" class="sub-action area-etc" @click="toggleEtcPopup">
        <div v-show="isEtcPopupShown" class="etc-popup">
          <div class="menu-option" @click="showPopupReportModal">
            記事を報告する
          </div>
          <!-- Fixme: リソース観点よりページ表示時に mute_users の取得を行っていない。
                    このためページを直接開いた場合ミュート済みかの判定ができず、再度ユーザをミュートすることが可能な状態となっている -->
          <div class="menu-option" @click="addMuteUser">
            ユーザーをミュートする
          </div>
        </div>
      </div>
    </no-ssr>
  </div>
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
    articleUserId: {
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
      isEtcPopupShown: false
    }
  },
  mounted() {
    this.listen(window, 'click', (event) => {
      if (!this.$el.contains(event.target)) {
        this.closeEtcPopup()
      }
    })
    this.listen(window, 'touchstart', (event) => {
      if (!this.$el.contains(event.target)) {
        this.closeEtcPopup()
      }
    })
    this.$el.querySelector(
      '.area-share-twitter'
    ).href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      location.href
    )}&text=${encodeURIComponent(`${this.article.title} | ALIS`)}`

    this.$el.querySelector(
      '.area-share-facebook'
    ).href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(location.href)}`
  },
  destroyed() {
    if (this._eventRemovers) {
      this._eventRemovers.forEach((eventRemover) => {
        eventRemover.remove()
      })
    }
  },
  computed: {
    formattedLikesCount() {
      return this.likesCount > 999 ? (this.likesCount / 1000).toFixed(1) + 'k' : this.likesCount
    },
    isMyArticle() {
      if (!this.currentUser) return false
      return this.articleUserId === this.currentUser.userId
    },
    ...mapGetters('user', ['loggedIn', 'currentUser', 'currentUserInfo']),
    ...mapGetters('article', ['article']),
    ...mapGetters(['toastMessages'])
  },
  methods: {
    toggleEtcPopup() {
      this.isEtcPopupShown = !this.isEtcPopupShown
    },
    closeEtcPopup() {
      this.isEtcPopupShown = false
    },
    showPopupReportModal() {
      if (this.loggedIn) {
        if (!this.currentUser.phoneNumberVerified) {
          this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'articleReport' })
          this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
          return
        }
        this.setArticleReportModal({ isShow: true })
        this.setArticleReportSelectReasonModal({ isShow: true })
      } else {
        this.setRequestLoginModal({ isShow: true, requestType: 'articleReport' })
      }
    },
    async like() {
      if (this.loggedIn) {
        if (this.isLikedArticle) return
        if (!this.currentUser.phoneNumberVerified) {
          this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'articleLike' })
          this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
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
    async tip() {
      if (this.loggedIn) {
        if (!this.currentUser.phoneNumberVerified) {
          this.setRequestPhoneNumberVerifyModal({ isShow: true, requestType: 'articleTip' })
          this.setRequestPhoneNumberVerifyInputPhoneNumberModal({ isShow: true })
          return
        }
        this.setTipModal({ showTipModal: true })
        this.setTipFlowSelectTipAmountModal({ isShow: true })
      } else {
        this.setRequestLoginModal({ isShow: true, requestType: 'articleTip' })
      }
    },
    listen(target, eventType, callback) {
      if (!this._eventRemovers) {
        this._eventRemovers = []
      }
      target.addEventListener(eventType, callback)
      this._eventRemovers.push({
        remove: function() {
          target.removeEventListener(eventType, callback)
        }
      })
    },
    async addMuteUser() {
      if (this.loggedIn) {
        try {
          await this.setMuteUser({ muteUserId: this.articleUserId })
          this.sendNotification({
            text: '登録に成功しました。該当ユーザの記事は一覧から表示されなくなります',
            dismissAfter: 7000
          })
          this.$router.push('/me/settings/mute_users')
        } catch (error) {
          this.sendNotification({
            text: '登録に失敗しました。しばらく時間を置いて再度お試しください',
            type: 'warning',
            dismissAfter: 7000
          })
        }
      } else {
        this.setRequestLoginModal({ isShow: true, requestType: 'muteUser' })
      }
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('user', [
      'setRequestLoginModal',
      'setTipModal',
      'setTipFlowSelectTipAmountModal',
      'setRequestPhoneNumberVerifyModal',
      'setRequestPhoneNumberVerifyInputPhoneNumberModal',
      'setFirstProcessModal',
      'setFirstProcessLikedArticleModal',
      'setMuteUser'
    ]),
    ...mapActions('report', ['setArticleReportModal', 'setArticleReportSelectReasonModal']),
    ...mapActions('article', ['postLike', 'getIsLikedArticle'])
  }
}
</script>

<style lang="scss" scoped>
.area-footer-actions {
  grid-template-columns: repeat(2, 52px) 1fr repeat(3, 40px);
  /* prettier-ignore */
  grid-template-areas:
    'like tip ... share-twitter share-facebook etc';
}

.area-footer-actions-own {
  grid-template-columns: repeat(2, 52px) 1fr repeat(2, 40px);
  /* prettier-ignore */
  grid-template-areas:
    'like tip ... share-twitter share-facebook';
}

.area-footer-actions,
.area-footer-actions-own {
  display: grid;
  grid-area: footer-actions;
  grid-template-rows: 52px;
  grid-column-gap: 20px;
  align-items: center;

  .action {
    height: 52px;
    width: 52px;
  }

  .sub-action {
    box-shadow: 0 3px 16px 0 rgba(0, 0, 0, 0.25);
    height: 40px;
    width: 40px;
  }

  .area-like {
    grid-area: like;
    background: #fff url('~assets/images/pc/article/icon_like.png') no-repeat;
    background-position: 9px;
    background-size: 32px;
    border-radius: 50%;
    border: 1px solid #ff4949;
    box-shadow: 0px 2px 15px -1px #ff4949;
    cursor: pointer;
    position: relative;
    box-sizing: border-box;

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

  .area-tip {
    grid-area: tip;
    background: #0086cc url('~assets/images/pc/article/icon_chip.png') no-repeat;
    background-position: 10px;
    background-size: 32px;
    box-shadow: 0px 2px 15px -1px #0086cc;
    cursor: pointer;
    border-radius: 50%;
  }

  .area-share-twitter {
    grid-area: share-twitter;
    background: #fff url('~assets/images/pc/article/icon_share_twitter.png') no-repeat;
    background-position-x: 9px;
    background-position-y: 9px;
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
    position: relative;
    cursor: pointer;
  }

  .area-etc {
    grid-area: etc;
    background: #fff url('~assets/images/pc/article/icon_etc.png') no-repeat;
    background-position: 8px;
    background-size: 24px;
    border-radius: 50%;
    cursor: pointer;
    position: relative;

    .etc-popup {
      background-color: #ffffff;
      border-radius: 4px;
      box-shadow: 0 4px 10px 0 rgba(192, 192, 192, 0.5);
      cursor: default;
      box-sizing: border-box;
      font-size: 14px;
      position: absolute;
      right: 0;
      top: 48px;
      width: 188px;
      z-index: 1;

      .menu-option {
        cursor: pointer;
        user-select: none;
        margin: 12px;
      }
    }
  }
}

@media screen and (max-width: 640px) {
  .area-footer-actions {
    background: linear-gradient(#fff 50%, rgba(35, 37, 56, 0.05) 50%);
    position: relative;
    grid-template-columns: 10px 40px 0 40px 1fr repeat(3, 40px) 10px;
    /* prettier-ignore */
    grid-template-areas:
      '... like ... tip ... share-twitter share-facebook etc ...';
    grid-column-gap: 10px;

    &:after {
      bottom: 26px;
      box-shadow: 0 15px 10px -10px rgba(192, 192, 192, 0.5);
      content: '';
      height: 100px;
      opacity: 0.5;
      position: absolute;
      width: 100%;
    }

    .action,
    .sub-action {
      z-index: 1;
    }

    .action {
      height: 40px;
      width: 40px;
    }

    .area-like {
      background-position: 7px;
      background-size: 24px;

      .likes-count {
        right: 6px;
        top: -32px;
      }

      &.liked {
        background-position: 7px;
        background-size: 24px;
      }
    }

    .area-tip {
      background-position: 8px;
      background-size: 24px;
    }

    .area-etc {
      .etc-popup {
        width: 178px;

        .menu-option {
          margin: 24px 12px;
        }
      }
    }
  }
}
</style>
