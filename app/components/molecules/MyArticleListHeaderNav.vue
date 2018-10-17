<template>
  <nav class="area-nav">
    <h1 class="area-title">記事一覧</h1>
    <app-button class="area-new-article">
      <a href="/me/articles/new">新規作成</a>
    </app-button>
    <nuxt-link to="/me/articles/public" class="nav-link area-public-articles">公開中</nuxt-link>
    <nuxt-link to="/me/articles/draft" class="nav-link area-drafts">下書き</nuxt-link>
  </nav>
</template>

<script>
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  }
}
</script>

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
  width: 1080px;
  margin: 0 auto;
  border-bottom: 1px solid rgba(#6e6e6e, 0.1);

  .area-new-article {
    grid-area: new-article;
    width: 110px;

    &:before,
    &:after {
      border-radius: 4px;
    }
  }
}

.area-title {
  align-self: center;
  color: #030303;
  font-size: 20px;
  font-weight: 500;
  grid-area: title;
  justify-self: flex-start;
  letter-spacing: 1.33px;
  margin: 0;
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

@media screen and (max-width: 1080px) {
  .area-nav {
    max-width: calc(100% - 68px);
    margin-left: 34px;
  }
}

@media screen and (max-width: 640px) {
  .area-nav .area-new-article {
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
