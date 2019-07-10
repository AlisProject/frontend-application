<template>
  <header class="area-mobile-editor-header-container">
    <nuxt-link to="/" class="logo-link" @click.native="resetData">
      <img class="logo" src="~assets/images/pc/common/header_logo_original.png" alt="logo">
    </nuxt-link>
    <span class="save-status">{{ saveStatus }}</span>
    <nuxt-link
      :to="`content_edit_histories`"
      class="history-icon fa fa-history"
      @click.native="resetHistories()"
    />
    <button class="post-article" @click="showMobileEditorHeaderPostArticleModal">
      公開する
    </button>
    <mobile-editor-header-post-article-modal v-if="mobileEditorHeaderPostArticleModal.isShow" />
    <toast position="n" />
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Toast } from 'vuex-toast'
import MobileEditorHeaderPostArticleModal from '../organisms/MobileEditorHeaderPostArticleModal'
import { isIOS, isAndroid } from '~/utils/device'
import { getThumbnails } from '~/utils/article'

export default {
  components: {
    Toast,
    MobileEditorHeaderPostArticleModal
  },
  data() {
    return {
      deviceType: 'pc'
    }
  },
  mounted() {
    if (isIOS()) {
      this.deviceType = 'ios'
    } else if (isAndroid()) {
      this.deviceType = 'android'
    }
  },
  computed: {
    ...mapGetters('user', ['loggedIn', 'mobileEditorHeaderPostArticleModal']),
    ...mapGetters('article', ['saveStatus', 'thumbnail'])
  },
  methods: {
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
    ...mapActions('presentation', ['setArticleListScrollHeight']),
    ...mapActions('article', [
      'resetArticleData',
      'resetArticleContentEditHistories',
      'updateSuggestedThumbnails',
      'updateThumbnail'
    ]),
    ...mapActions('user', ['setMobileEditorHeaderPostArticleModal'])
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
    right: 109px;
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
