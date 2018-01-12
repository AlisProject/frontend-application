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
  display: flex;
  grid-area: app-footer;
  align-items: center;
  justify-content: center;
}

.link {
  font-size: 12px;
  margin: 0 1.4em;
  text-decoration: none;
  color: #7b7b7b;
}
</style>
