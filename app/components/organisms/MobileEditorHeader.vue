<template>
  <header class="area-mobile-editor-header-container">
    <nuxt-link to="/" class="logo-link" @click.native="resetData">
      <img class="logo" src="~assets/images/pc/common/header_logo_original.svg" alt="logo">
    </nuxt-link>
    <span class="save-status">{{ saveStatus }}</span>
    <div v-if="type === 'draft-article'" class="area-article-menu" @click="toggleArticlePopup">
      <div v-show="isArticlePopupShown" class="article-popup">
        <nuxt-link
          class="article-popup-content"
          :to="`${historiesPath}`"
          @click.native="resetHistories()"
        >
          編集履歴一覧
        </nuxt-link>
        <span class="article-popup-content" @click="showArticleDeleteModal">
          削除
        </span>
      </div>
    </div>
    <nuxt-link
      v-if="type !== 'draft-article'"
      :to="`${historiesPath}`"
      class="history-icon fa fa-history"
      @click.native="resetHistories()"
    />
    <button class="post-article" @click="showMobileEditorHeaderPostArticleModal">
      公開する
    </button>
    <mobile-editor-header-post-article-modal v-if="mobileEditorHeaderPostArticleModal.isShow" />
    <article-delete-modal v-if="articleDeleteModal.isShow" />
    <toast position="n" />
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Toast } from 'vuex-toast'
import MobileEditorHeaderPostArticleModal from '../organisms/MobileEditorHeaderPostArticleModal'
import ArticleDeleteModal from '../organisms/ArticleDeleteModal'
import { isIOS, isAndroid } from '~/utils/device'
import { getThumbnails } from '~/utils/article'

export default {
  components: {
    Toast,
    MobileEditorHeaderPostArticleModal,
    ArticleDeleteModal
  },
  props: {
    type: {
      type: String,
      default: 'public-article'
    }
  },
  data() {
    return {
      isArticlePopupShown: false,
      deviceType: 'pc'
    }
  },
  mounted() {
    this.listen(window, 'click', (event) => {
      if (
        this.$el.querySelector('.area-article-menu') &&
        !this.$el.querySelector('.area-article-menu').contains(event.target)
      ) {
        this.closeEtcPopup()
      }
    })
    this.listen(window, 'touchstart', (event) => {
      if (
        this.$el.querySelector('.area-article-menu') &&
        !this.$el.querySelector('.area-article-menu').contains(event.target)
      ) {
        this.closeEtcPopup()
      }
    })
    if (isIOS()) {
      this.deviceType = 'ios'
    } else if (isAndroid()) {
      this.deviceType = 'android'
    }
  },
  destroyed() {
    if (this._eventRemovers) {
      this._eventRemovers.forEach((eventRemover) => {
        eventRemover.remove()
      })
    }
  },
  computed: {
    historiesPath() {
      const articleStatus = this.$route.path.startsWith('/me/articles/public/') ? 'public' : 'draft'
      return `/me/articles/${articleStatus}/v2/${this.articleId}/content_edit_histories`
    },
    ...mapGetters('user', ['loggedIn', 'mobileEditorHeaderPostArticleModal']),
    ...mapGetters('article', ['articleId', 'saveStatus', 'thumbnail']),
    ...mapGetters('articleModals', ['articleDeleteModal'])
  },
  methods: {
    showArticleDeleteModal() {
      this.setArticleDeleteModal({ isShow: true })
    },
    toggleArticlePopup() {
      this.isArticlePopupShown = !this.isArticlePopupShown
    },
    closeEtcPopup() {
      this.isArticlePopupShown = false
    },
    resetData() {
      // 同一のページの場合は記事情報をリセットしない
      if (this.$route.fullPath === '/') return
      this.resetArticleData()
      this.setArticleListScrollHeight({ scroll: 0 })
    },
    resetHistories() {
      this.resetArticleContentEditHistories()
    },
    showMobileEditorHeaderPostArticleModal() {
      this.setThumbnails()
      this.setMobileEditorHeaderPostArticleModal({ isShow: true })
    },
    setThumbnails() {
      const images = Array.from(document.querySelectorAll('figure img'))
      const thumbnails = getThumbnails(images)
      this.updateSuggestedThumbnails({ thumbnails })
      if (!thumbnails.includes(this.thumbnail)) {
        this.updateThumbnail({ thumbnail: '' })
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
    ...mapActions('presentation', ['setArticleListScrollHeight']),
    ...mapActions('article', [
      'resetArticleData',
      'resetArticleContentEditHistories',
      'updateSuggestedThumbnails',
      'updateThumbnail'
    ]),
    ...mapActions('user', ['setMobileEditorHeaderPostArticleModal']),
    ...mapActions('articleModals', ['setArticleDeleteModal'])
  }
}
</script>

<style lang="scss" scoped>
.pc,
.ios,
.android {
  .area-mobile-editor-header-container {
    grid-area: mobile-editor-header;
    z-index: 2002;
    display: flex;
    align-items: center;
    position: relative;
    width: 1080px;
    margin: 0 auto;
  }

  .logo-link {
    margin: 0 auto;

    .logo {
      width: 102px;
      height: auto;
    }
  }
}

@media screen and (max-width: 1080px) {
  .pc .area-mobile-editor-header-container {
    max-width: calc(100% - 68px);
  }
}

.ios .area-mobile-editor-header-container {
  position: absolute;
}

.android .area-mobile-editor-header-container {
  position: fixed;
}

.ios,
.android {
  .area-mobile-editor-header-container {
    max-width: 100%;
    background: #fff;
    top: 0;
    right: 0;
    left: 0;
    height: 56px;
    width: 100%;
  }

  .logo-link {
    left: 12px;
    padding: 12px 0;
    position: absolute;

    .logo {
      width: auto;
      height: 26px;
    }
  }

  .save-status {
    color: #6e6e6e;
    font-size: 12px;
    position: absolute;
    right: 112px;
    width: 48px;
  }

  .history-icon {
    color: #6e6e6e;
    font-size: 27px;
    position: absolute;
    text-decoration: none;
    width: 27px;
    right: 0;
    margin: 0 81px 0 0;
  }

  .area-article-menu {
    background: #fff url('~assets/images/pc/article/icon_etc.png') no-repeat;
    background-size: 24px;
    cursor: pointer;
    position: absolute;
    width: 30px;
    height: 27px;
    right: 0;
    margin: 0 75px 0 0;

    .article-popup {
      background-color: #ffffff;
      border-radius: 4px;
      filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.25));
      cursor: default;
      box-sizing: border-box;
      font-size: 14px;
      padding: 8px 16px;
      position: absolute;
      right: 0px;
      top: 24px;
      z-index: 1;

      .article-popup-content {
        color: #6e6e6e;
        cursor: pointer;
        display: inline-block;
        font-size: 14px;
        font-weight: 500;
        line-height: 2;
        text-align: left;
        text-decoration: none;
        user-select: none;
        white-space: nowrap;
        width: 100%;
      }
    }
  }

  .post-article {
    background-color: #0086cc;
    border-radius: 2px;
    border: 0;
    color: #fff;
    font-size: 12px;
    height: 24px;
    outline: none;
    padding: 0;
    position: absolute;
    right: 12px;
    width: 60px;
  }
}
</style>
