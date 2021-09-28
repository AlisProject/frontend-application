<template>
  <header class="area-mobile-editor-header-container" :class="{ 'is-fixed': isFixed }">
    <nuxt-link to="/" class="logo-link" @click.native="resetData">
      <img class="logo" src="~assets/images/pc/common/header_logo_original.svg" alt="logo">
    </nuxt-link>
    <span class="save-status">{{ saveStatus }}</span>
    <select-paypart-publish-button class="post-article" />
  </header>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import SelectPaypartPublishButton from '../molecules/SelectPaypartPublishButton'
import { isIOS, isAndroid } from '~/utils/device'

export default {
  components: {
    SelectPaypartPublishButton
  },
  data() {
    return {
      deviceType: 'pc',
      isFixed: false
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    if (isIOS()) {
      this.deviceType = 'ios'
    } else if (isAndroid()) {
      this.deviceType = 'android'
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  computed: {
    ...mapGetters('user', ['loggedIn']),
    ...mapGetters('article', ['saveStatus'])
  },
  methods: {
    resetData() {
      // 同一のページの場合は記事情報をリセットしない
      if (this.$route.fullPath === '/') return
      this.resetArticleData()
      this.setArticleListScrollHeight({ scroll: 0 })
    },
    handleScroll() {
      this.isFixed = window.scrollY >= 1
    },
    ...mapActions('presentation', ['setArticleListScrollHeight']),
    ...mapActions('article', ['resetArticleData'])
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

    &.is-fixed {
      box-shadow: 0 12px 12px -12px rgba(192, 192, 192, 0.7);
      left: 0;
      position: fixed;
      right: 0;
    }
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
    right: 90px;
    width: 48px;
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
    box-shadow: none;
    line-height: normal;
  }
}
</style>
