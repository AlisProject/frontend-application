<template>
  <transition name="fade">
    <div class="article-side-actions" v-show="scrollY > 300">
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
    </div>
  </transition>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

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
    this.listen(window, 'click', (event) => {
      if (!this.$el.contains(event.target)) {
        this.closeSharePopup()
      }
    })
    this.$el.querySelector(
      '.share-twitter'
    ).href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      location.href
    )}&text=${encodeURIComponent(document.title)}`
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
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
    ...mapGetters('user', ['loggedIn'])
  },
  methods: {
    handleScroll() {
      this.scrollY = window.scrollY
    },
    toggleSharePopup() {
      this.isSharePopupShown = !this.isSharePopupShown
    },
    closeSharePopup() {
      this.isSharePopupShown = false
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
    ...mapActions('article', ['postLike', 'getIsLikedArticle']),
    ...mapActions('user', ['setRequestLoginModal'])
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
    width: 60px;
    height: 60px;
  }

  .like {
    background-position-y: -4px;
    background: url('~assets/images/pc/article/btn_like.png') no-repeat;
    background-size: 80px;
    cursor: pointer;
    height: 80px;
    position: relative;
    width: 80px;

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
      left: 25px;
      position: absolute;
      text-align: center;
      top: -22px;
      width: 30px;
    }
  }

  .share {
    background: url('~assets/images/pc/article/btn_share.png') no-repeat;
    background-size: 60px;
    position: relative;
    cursor: pointer;

    .share-popup {
      background: url('~assets/images/pc/article/icon_twitter.png') no-repeat;
      background-color: #ffffff;
      background-size: 24px;
      background-position-x: 16px;
      background-position-y: 14px;
      border-radius: 4px;
      box-shadow: 0 4px 10px 0 rgba(192, 192, 192, 0.5);
      cursor: default;
      box-sizing: border-box;
      font-size: 14px;
      padding: 16px 16px 16px 48px;
      position: absolute;
      right: 12px;
      top: 52px;
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
