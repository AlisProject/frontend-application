<template>
  <footer class="area-sub-footer-container">
    <a
      href="https://intercom.help/alismedia"
      class="link"
      target="_blank"
      rel="noopener noreferrer nofollow"
    >
      よくある質問・問い合わせ
    </a>
    <nuxt-link to="/terms" class="link">
      利用規約
    </nuxt-link>
    <nuxt-link to="/privacy" class="link">
      プライバシーポリシー
    </nuxt-link>
    <nuxt-link to="/users/ALIS-official" class="link">
      公式アナウンス
    </nuxt-link>
    <nuxt-link to="/users/AB2" class="link">
      技術ブログ
    </nuxt-link>
    <a href="https://github.com/AlisProject/api-docs" class="link" target="_blank">開発者向けAPI</a>
    <a href="https://alismedia.jp/ja/" class="link" target="_blank">運営会社</a>
    <nuxt-link v-if="isPc" to="/me/settings/applications" class="link">
      アプリケーション
    </nuxt-link>
  </footer>
</template>

<script>
import { isMobile } from '~/utils/device'

export default {
  data() {
    return {
      isPc: true
    }
  },
  mounted() {
    this.isPc = !isMobile()
  }
}
</script>

<style lang="scss">
.area-sub-footer-container {
  grid-area: sub-footer;
  padding: 0 28px 0 46px;

  .link {
    color: #6e6e6e;
    font-size: 12px;
    font-weight: bold;
    text-decoration: none;
    margin: 0 18px 14px 0;
    white-space: nowrap;
    display: inline-block;
  }
}
</style>
