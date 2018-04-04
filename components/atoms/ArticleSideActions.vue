<template>
  <transition name="fade">
    <div class="article-side-actions" v-show="scrollY > 300">
      <div class="action like">
        <span class="likes-count">{{ likesCount }}</span>
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
export default {
  props: {
    likesCount: {
      type: Number,
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
    this.$el.querySelector('.share-twitter').href = `https://twitter.com/intent/tweet?url=${
      location.href
    }&text=${document.title}`
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    if (this._eventRemovers) {
      this._eventRemovers.forEach((eventRemover) => {
        eventRemover.remove()
      })
    }
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
    }
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
    background: url('~assets/images/pc/article/icon_heart.png') no-repeat;
    background-color: #ff4949;
    background-size: 30px;
    background-position: 16px 20px;
    border-radius: 50%;
    border: 1px solid #ff4949;
    box-shadow: 0px 5px 15px -1px #ff8989;
    height: 62px;
    width: 62px;

    .likes-count {
      color: #585858;
      font-size: 14px;
      position: absolute;
      top: -22px;
      left: 17px;
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
