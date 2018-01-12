<template>
  <header class="area-app-header-container">
    <nuxt-link to="/" class="area-logo">logo here</nuxt-link>
    <nav class="area-nav">
      <nuxt-link to="/" class="nav-link area-popular-stories">人気記事</nuxt-link>
      <nuxt-link to="#" class="nav-link area-new-stories">新着記事</nuxt-link>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.area-app-header-container {
  display: grid;
  grid-area: app-header;
  grid-template-rows: 100px;
  grid-template-columns: 100px 1fr 100px;
  /* prettier-ignore */
  grid-template-areas:
    "logo nav";
  position: relative;
}

.area-logo {
  grid-area: logo;
}

.area-nav {
  grid-area: nav;
  display: grid;
  text-align: center;
  grid-template-rows: 1fr 30px 1fr;
  grid-template-columns: 1fr 60px 42px 60px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "... ...             ... ...         ..."
    "... popular-stories ... new-stories ..."
    "... ...             ... ...         ...";
}

.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: #525256;
}

.area-popular-stories {
  grid-area: popular-stories;
}

.area-new-stories {
  grid-area: new-stories;
}
</style>
