<template>
  <div class="area-footer-actions">
    <div class="action area-like" :class="{ liked: isLikedArticle }" @click="like">
      <span class="likes-count">{{ formattedLikesCount }}</span>
    </div>
    <no-ssr>
      <div class="action area-tip" @click="tip" v-if="!isMyArticle"/>
    </no-ssr>
    <div class="sub-action area-share" @click="toggleSharePopup">
      <div class="share-popup" v-show="isSharePopupShown">
        <a class="share-twitter" target="_blank">
          Twitterでシェアする
        </a>
      </div>
    </div>
    <div class="sub-action area-etc" @click="toggleEtcPopup">
      <div class="etc-popup" v-show="isEtcPopupShown">
        <span class="report" @click="showPopupReportModal">
          通報する
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  data() {
    return {
      isEtcPopupShown: false,
      isSharePopupShown: false
    }
  },
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
  mounted() {
    this.listen(window, 'click', (event) => {
      if (!this.$el.contains(event.target)) {
        this.closeEtcPopup()
        this.closeSharePopup()
      }
    })
    this.listen(window, 'touchstart', (event) => {
      if (!this.$el.contains(event.target)) {
        this.closeEtcPopup()
        this.closeSharePopup()
      }
    })
    this.$el.querySelector(
      '.share-twitter'
    ).href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      location.href
    )}&text=${encodeURIComponent(`${this.article.title} | ALIS`)}`
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
    ...mapGetters('user', ['loggedIn', 'showReportModal', 'currentUser']),
    ...mapGetters('article', ['article']),
    ...mapGetters(['toastMessages'])
  },
  methods: {
    toggleEtcPopup() {
      this.isEtcPopupShown = !this.isEtcPopupShown
      if (this.isSharePopupShown) this.closeSharePopup()
    },
    toggleSharePopup() {
      this.isSharePopupShown = !this.isSharePopupShown
      if (this.isEtcPopupShown) this.closeEtcPopup()
    },
    closeEtcPopup() {
      this.isEtcPopupShown = false
    },
    closeSharePopup() {
      this.isSharePopupShown = false
    },
    showPopupReportModal() {
      if (this.loggedIn) {
        this.setReportModal({ showReportModal: true })
        window.scrollTo(0, 0)
        document.querySelector('html,body').style.overflow = 'hidden'
      } else {
        this.setRequestLoginModal({ isShow: true, requestType: 'articleLike' })
        window.scrollTo(0, 0)
        document.querySelector('html,body').style.overflow = 'hidden'
      }
    },
    async like() {
      if (this.loggedIn) {
        if (!this.isLikedArticle) {
          await this.postLike({ articleId: this.articleId })
          await this.getIsLikedArticle({ articleId: this.articleId })
        }
      } else {
        this.setRequestLoginModal({ isShow: true, requestType: 'articleLike' })
        window.scrollTo(0, 0)
        if (window.innerWidth > 550) {
          document.querySelector('html,body').style.overflow = 'hidden'
        }
      }
    },
    async tip() {
      if (this.loggedIn) {
        this.setTipModal({ showTipModal: true })
        this.setTipFlowSelectTipAmountModal({ isShow: true })
        window.scrollTo(0, 0)
        document.querySelector('html,body').style.overflow = 'hidden'
      } else {
        this.setRequestLoginModal({ isShow: true, requestType: 'articleTip' })
        window.scrollTo(0, 0)
        if (window.innerWidth > 550) {
          document.querySelector('html,body').style.overflow = 'hidden'
        }
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
    ...mapActions('user', [
      'setReportModal',
      'setRequestLoginModal',
      'setTipModal',
      'setTipFlowSelectTipAmountModal'
    ]),
    ...mapActions('article', ['postLike', 'getIsLikedArticle'])
  }
}
</script>

<style lang="scss" scoped>
.area-footer-actions {
  display: grid;
  grid-area: footer-actions;
  grid-template-rows: 52px;
  grid-template-columns: repeat(2, 52px) 1fr repeat(2, 40px);
  grid-column-gap: 20px;
  /* prettier-ignore */
  grid-template-areas:
    'like tip ... share etc';
  align-items: center;

  .action {
    height: 52px;
    width: 52px;
  }

  .sub-action {
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
    background: #858dda url('~assets/images/pc/article/icon_chip.png') no-repeat;
    background-position: 10px;
    background-size: 32px;
    box-shadow: 0px 2px 15px -1px #858dda;
    cursor: pointer;
    border-radius: 50%;
  }

  .area-share {
    grid-area: share;
    background: #fff url('~assets/images/pc/article/icon_share.png') no-repeat;
    background-position: 8px;
    background-size: 24px;
    border-radius: 50%;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.25);
    position: relative;
    cursor: pointer;

    .share-popup {
      background: url('~assets/images/pc/article/icon_twitter.png') no-repeat;
      background-color: #ffffff;
      background-size: 22px;
      background-position-x: 16px;
      background-position-y: 12px;
      border-radius: 4px;
      box-shadow: 0 4px 10px 0 rgba(192, 192, 192, 0.5);
      cursor: default;
      box-sizing: border-box;
      font-size: 14px;
      padding: 12px 12px 12px 48px;
      position: absolute;
      right: 0;
      top: 48px;
      width: 200px;
      z-index: 1;

      .share-twitter {
        cursor: pointer;
        color: #585858;
        text-decoration: none;
        user-select: none;
      }
    }
  }

  .area-etc {
    grid-area: etc;
    background: #fff url('~assets/images/pc/article/icon_etc.png') no-repeat;
    background-position: 8px;
    background-size: 24px;
    border-radius: 50%;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.25);
    cursor: pointer;
    position: relative;

    .etc-popup {
      background-color: #ffffff;
      border-radius: 4px;
      box-shadow: 0 4px 10px 0 rgba(192, 192, 192, 0.5);
      cursor: default;
      box-sizing: border-box;
      font-size: 14px;
      padding: 12px;
      position: absolute;
      right: 0;
      top: 48px;
      width: 90px;
      z-index: 1;

      .report {
        cursor: pointer;
        user-select: none;
      }
    }
  }
}

@media screen and (max-width: 640px) {
  .area-footer-actions {
    background: linear-gradient(#fff 50%, rgba(35, 37, 56, 0.05) 50%);
    position: relative;
    grid-template-columns: 0 repeat(2, 40px) 1fr repeat(2, 40px) 0;
    /* prettier-ignore */
    grid-template-areas:
      '... like tip ... share etc ...';

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
  }
}
</style>
