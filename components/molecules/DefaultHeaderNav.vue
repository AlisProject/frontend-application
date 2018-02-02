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

@media screen and (max-width: 920px) {
  .story-container {
    .area-nav {
      grid-gap: 20px;
      /* prettier-ignore */
      grid-template-areas:
      'popular-stories new-stories';
      grid-template-columns: 48px 48px;
      grid-template-rows: 32px;
      text-align: left;
    }

    .nav-link {
      display: none;
    }
  }
}

@media screen and (max-width: 550px) {
  .area-nav {
    grid-gap: 20px;
    /* prettier-ignore */
    grid-template-areas:
      'popular-stories new-stories';
    grid-template-columns: 48px 48px;
    grid-template-rows: 32px;
    text-align: left;
  }

  .nav-link {
    font-size: 12px;
  }

  .popular-stories .area-popular-stories {
    color: #99a2ff;
    border-bottom: 2px solid #99a2ff;
  }
}
</style>
