<template>
  <footer class="area-app-footer-container">
    <nuxt-link to="/users/ALIS-official" class="link">公式アナウンス</nuxt-link>
    <nuxt-link to="/terms" class="link">利用規約</nuxt-link>
    <nuxt-link to="/privacy" class="link">プライバシーポリシー</nuxt-link>
    <nuxt-link to="/token-use-guidline" class="link">ALISトークン利用ガイドライン</nuxt-link>
    <a href="https://intercom.help/alismedia" class="link" target="_blank" rel="noopener noreferrer nofollow">
      ヘルプ
    </a>
    <a href="https://alismedia.jp/ja/" class="link" target="_blank">運営会社</a>
  </footer>
</template>

<style lang="scss" scoped>
.area-app-footer-container {
  align-items: center;
  background: #05051e;
  display: flex;
  grid-area: app-footer;
  justify-content: center;
}

.link {
  color: #fff;
  font-size: 12px;
  line-height: 16px;
  margin: 0 1.4em;
  text-decoration: none;
}

@media screen and (max-width: 640px) {
  .area-app-footer-container {
    align-items: flex-start;
    flex-flow: column nowrap;
    justify-content: flex-start;
    padding: 1.3em 0 1em;
  }

  .link {
    font-size: 12px;
    margin: 0 2em 1em;
    text-decoration: none;

    &:last-child {
      margin-bottom: 24px;
    }
  }
}
</style>
