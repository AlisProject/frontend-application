<template>
  <div class="area-footer-actions">
    <div class="action like" :class="{ liked: this.isLikedArticle }" @click="like">
      <span class="likes-count">{{ formattedLikesCount }}</span>
    </div>
    <div class="action share" @click="toggleSharePopup">
      <div class="share-popup" v-show="isSharePopupShown">
        <a class="share-twitter" target="_blank">
          Twitterでシェアする
        </a>
      </div>
    </div>
    <div class="action etc" @click="toggleEtcPopup">
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
    ...mapGetters('user', ['loggedIn', 'showReportModal']),
    ...mapGetters('article', ['article'])
  },
  methods: {
    toggleEtcPopup() {
      this.isEtcPopupShown = !this.isEtcPopupShown
    },
    toggleSharePopup() {
      this.isSharePopupShown = !this.isSharePopupShown
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
        this.setRequestLoginModal({ showRequestLoginModal: true })
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
        this.setRequestLoginModal({ showRequestLoginModal: true })
        window.scrollTo(0, 0)
        document.querySelector('html,body').style.overflow = 'hidden'
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
    ...mapActions('user', ['setReportModal', 'setRequestLoginModal']),
    ...mapActions('article', ['postLike', 'getIsLikedArticle'])
  }
}
</script>

<style lang="scss" scoped>
.area-footer-actions {
  display: grid;
  grid-area: footer-actions;
  grid-template-rows: 80px;
  grid-template-columns: 1fr repeat(2, 60px);
  justify-content: right;

  .action {
    width: 60px;
    height: 60px;
  }

  .etc {
    background: url('~assets/images/pc/article/btn_etc.png') no-repeat;
    background-size: 54px;
    background-position-y: 10px;
    position: relative;
    cursor: pointer;

    .etc-popup {
      background-color: #ffffff;
      border-radius: 4px;
      box-shadow: 0 4px 10px 0 rgba(192, 192, 192, 0.5);
      cursor: default;
      box-sizing: border-box;
      font-size: 14px;
      padding: 12px;
      position: absolute;
      right: 34px;
      top: 62px;
      width: 90px;
      z-index: 1;

      .report {
        cursor: pointer;
        user-select: none;
      }
    }
  }

  .share {
    background: url('~assets/images/pc/article/btn_share.png') no-repeat;
    background-size: 54px;
    position: relative;
    cursor: pointer;
    background-position-y: 10px;

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
      right: 34px;
      top: 62px;
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

  .like {
    background: url('~assets/images/pc/article/btn_like.png') no-repeat;
    background-size: 80px;
    cursor: pointer;
    width: 80px;
    height: 80px;
    position: relative;
    background-position-y: -4px;

    &.liked {
      background-position-y: -4px;
      background: url('~assets/images/pc/article/btn_like_selected.png') no-repeat;
      background-size: 80px;
      cursor: not-allowed;
      height: 80px;
      position: relative;
      width: 80px;
    }

    .likes-count {
      color: #585858;
      font-size: 14px;
      position: absolute;
      right: -35px;
      text-align: left;
      top: 28px;
      width: 30px;
    }
  }
}

@media screen and (max-width: 640px) {
  .area-footer-actions {
    position: relative;

    &:after {
      bottom: 46px;
      box-shadow: 0 15px 10px -10px rgba(192, 192, 192, 0.5);
      content: '';
      height: 100px;
      opacity: 0.5;
      position: absolute;
      width: 100%;
    }

    .action {
      z-index: 1;

      .likes-count {
        top: -18px;
        right: 24px;
        text-align: center;
      }
    }
  }
}
</style>
