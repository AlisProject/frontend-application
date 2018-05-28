<template>
  <div class="public-article-pc-share-buttons">
    <a class="action twitter" :href="twitterShareUrl" target="_blank"/>
    <div class="action copy" @click="toggleCopyPopup">
      <div class="share-popup" v-show="isCopyPopupShown" @click="execCopyUrl">
        シェア用のURLをコピーする
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

export default {
  data() {
    return {
      isCopyPopupShown: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    this.listen(window, 'click', (event) => {
      if (!this.$el.contains(event.target)) {
        this.closeCopyPopup()
      }
    })
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
    shareUrl() {
      return `https://${process.env.DOMAIN}/${this.article.user_id}/articles/${
        this.article.article_id
      }`
    },
    twitterShareUrl() {
      return `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        this.shareUrl
      )}&text=${encodeURIComponent(`${this.article.title} | ALIS`)}`
    },
    ...mapGetters('article', ['article'])
  },
  methods: {
    toggleCopyPopup() {
      this.isCopyPopupShown = !this.isCopyPopupShown
    },
    closeCopyPopup() {
      this.isCopyPopupShown = false
    },
    execCopyUrl() {
      const copied = this.execCopy(this.shareUrl)
      if (copied) {
        this.sendNotification({ text: 'URLをコピーしました' })
      } else {
        this.sendNotification({ text: 'コピーができませんでした', type: 'warning' })
      }
    },
    execCopy(string) {
      const temp = document.createElement('div')
      temp.appendChild(document.createElement('pre')).textContent = string
      const s = temp.style
      s.position = 'fixed'
      s.left = '-100%'
      document.body.appendChild(temp)
      document.getSelection().selectAllChildren(temp)
      const result = document.execCommand('copy')
      document.body.removeChild(temp)
      return result
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
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    })
  }
}
</script>

<style lang="scss" scoped>
.public-article-pc-share-buttons {
  align-items: center;
  display: flex;
  flex-flow: column nowrap;
  left: calc(50% - 450px);
  position: absolute;
  top: 160px;

  .action {
    cursor: pointer;
    height: 60px;
    position: relative;
    width: 60px;
  }

  .twitter {
    background: url('~assets/images/pc/article/btn_share_twitter.png') no-repeat;
    background-size: 60px;
  }

  .copy {
    background: url('~assets/images/pc/article/btn_share_copylink.png') no-repeat;
    background-size: 60px;

    .share-popup {
      background-color: #ffffff;
      border-radius: 4px;
      box-shadow: 0 4px 10px 0 rgba(192, 192, 192, 0.5);
      box-sizing: border-box;
      color: #6e6e6e;
      font-size: 14px;
      padding: 14px 16px;
      position: absolute;
      right: 12px;
      top: 58px;
      user-select: none;
      width: 215px;
      z-index: 1;
    }
  }
}

@media screen and (max-width: 920px) {
  .public-article-pc-share-buttons {
    align-items: flex-end;
    bottom: 30px;
    display: flex;
    flex-flow: row nowrap;
    left: calc(50% - 60px);
    position: fixed;
    bottom: 20px;

    .copy {
      .share-popup {
        right: -74px;
        top: -50px;
      }
    }
  }
}
</style>
