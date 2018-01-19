<template>
  <nav class="area-nav">
    <nuxt-link to="/stories/public" class="nav-link area-public-stories">公開済み</nuxt-link>
    <nuxt-link to="#" class="nav-link area-drafs">下書き</nuxt-link>
    <nuxt-link to="/stories/new" class="nav-link area-new-story">新規作成</nuxt-link>
    <nuxt-link to="#" class="nav-link area-post-story">公開する</nuxt-link>
  </nav>
</template>

<style lang="scss" scoped>
.area-nav {
  grid-area: nav;
  display: grid;
  text-align: center;
  grid-template-rows: 1fr 30px 1fr;
  grid-template-columns: 1fr 60px 60px 60px 1fr 60px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "... ...            ...   ...       ... ...        ..."
    "... public-stories drafs new-story ... post-story ..."
    "... ...            ...   ...       ... ...        ...";
}

.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: #525256;
}

.area-public-stories {
  grid-area: public-stories;
}

.area-drafs {
  grid-area: drafs;
}

.area-new-story {
  grid-area: new-story;
}

.area-post-story {
  grid-area: post-story;
}
</style>
