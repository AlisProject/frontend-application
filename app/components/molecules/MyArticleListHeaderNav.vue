<template>
  <nav class="area-nav">
    <h1 class="area-title">記事一覧</h1>
    <a href="/me/articles/new" class="area-new-article">新規作成</a>
    <nuxt-link to="/me/articles/public" class="nav-link area-public-articles">公開済み</nuxt-link>
    <nuxt-link to="/me/articles/draft" class="nav-link area-drafts">下書き</nuxt-link>
  </nav>
</template>

<style lang="scss" scoped>
.area-nav {
  grid-area: nav;
  display: grid;
  text-align: center;
  grid-template-rows: 38px 30px;
  grid-template-columns: 70px 70px 1fr auto;
  grid-row-gap: 50px;
  /* prettier-ignore */
  grid-template-areas:
    "title           title  ... new-article"
    "public-articles drafts ... ...        ";
  max-width: 1080px;
  margin-left: calc(50vw - 540px);
  border-bottom: 1px solid rgba(#6e6e6e, 0.1);
}

.area-title {
  grid-area: title;
  color: #030303;
  font-size: 20px;
  font-weight: 500;
  letter-spacing: 1.33px;
  justify-self: flex-start;
}

.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: #929292;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.area-public-articles {
  grid-area: public-articles;
}

.area-drafts {
  grid-area: drafts;
}

.public-article .area-public-articles,
.public-articles .area-public-articles,
.drafts .area-drafts {
  color: #99a2ff;
  border-bottom: 2px solid #99a2ff;
}

.area-new-article {
  grid-area: new-article;
  align-items: center;
  background: linear-gradient(314.72deg, #232538 0%, #858dda 100%);
  border-radius: 4px;
  color: white;
  display: flex;
  font-size: 14px;
  justify-content: center;
  text-decoration: none;
  width: 110px;
}

@media screen and (max-width: 1080px) {
  .area-nav {
    max-width: calc(100% - 68px);
    margin-left: 34px;
  }
}

@media screen and (max-width: 640px) {
  .area-new-article {
    display: none;
  }
}

@media screen and (max-width: 550px) {
  .area-nav {
    border: none;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
    grid-gap: 20px;
    grid-template-columns: 48px 48px;
    grid-template-rows: 28px;
    margin-left: 0;
    max-width: 100%;
    padding-left: 22px;
    /* prettier-ignore */
    grid-template-areas:
      'public-articles drafts';
  }

  .public-article .nav-link,
  .area-title {
    display: none;
  }

  .nav-link {
    font-size: 12px;
  }

  .public-articles .area-public-articles,
  .drafts .area-drafts {
    border-bottom: 1px solid #99a2ff;
  }
}

@media screen and (max-width: 370px) {
  .area-nav {
    padding-left: 10px;
  }
}
</style>
