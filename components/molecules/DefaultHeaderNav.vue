<template>
  <nav class="area-nav">
    <nuxt-link to="/" class="nav-link area-popular-stories">人気記事</nuxt-link>
    <nuxt-link to="#" class="nav-link area-new-stories">新着記事</nuxt-link>
  </nav>
</template>

<style lang="scss" scoped>
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

.popular-stories .area-popular-stories {
  color: white;
  display: block;
  border-bottom: 2px solid white;
}
</style>
