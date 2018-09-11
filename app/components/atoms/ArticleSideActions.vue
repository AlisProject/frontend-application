<template>
  <transition name="fade">
    <div class="article-side-actions" v-show="scrollY > 300">
      <div class="action like" :class="{ liked: isLikedArticle }" @click="like">
        <span class="likes-count" @click.stop>{{ formattedLikesCount }}</span>
      </div>
      <div class="sub-action share" @click="toggleSharePopup">
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
    )}&text=${encodeURIComponent(`${this.article.title} | ALIS`)}`
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
    ...mapGetters('user', ['loggedIn']),
    ...mapGetters('article', ['article'])
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
        this.setRequestLoginModal({ isShow: true, requestType: 'articleLike' })
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

  .share {
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
