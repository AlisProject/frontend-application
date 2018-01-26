<template>
  <footer class="area-app-footer-container">
    <nuxt-link to="#" class="link">ALISについて</nuxt-link>
    <nuxt-link to="#" class="link">利用規約</nuxt-link>
    <nuxt-link to="#" class="link">プライバシーポリシー</nuxt-link>
    <nuxt-link to="#" class="link">ヘルプ</nuxt-link>
    <nuxt-link to="#" class="link">運営会社</nuxt-link>
  </footer>
</template>

<style lang="scss" scoped>
.area-app-footer-container {
  align-items: center;
  display: flex;
  grid-area: app-footer;
  justify-content: center;
}

.link {
  color: #6e6e6e;
  font-size: 12px;
  line-height: 16px;
  margin: 0 1.4em;
  text-decoration: none;
}

@media screen and (max-width: 550px) {
  .area-app-footer-container {
    align-items: flex-start;
    background: white;
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
