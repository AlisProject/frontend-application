<template>
  <footer class="area-app-footer-container">
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
    <a href="https://www.livedoor.com/privacy/" target="_blank" class="link">
      プライバシーポリシー
    </a>
    <a href="/users/ALIS-official" class="link">
      公式アナウンス
    </a>
    <a href="/users/AB2" class="link">
      技術ブログ
    </a>
    <a href="https://github.com/AlisProject/api-docs" class="link" target="_blank">API</a>
    <a href="https://alismedia.jp/ja/" class="link" target="_blank">運営会社</a>
  </footer>
</template>

<style lang="scss" scoped>
.area-app-footer-container {
  -moz-osx-font-smoothing: auto;
  -webkit-font-smoothing: auto;
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
    margin: 0 2em;
    text-decoration: none;
    padding: 12px 0;
  }
}
</style>
