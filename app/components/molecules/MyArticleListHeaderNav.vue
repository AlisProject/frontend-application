<template>
  <nav class="area-nav">
    <h1 class="area-title">記事一覧</h1>
    <a href="/me/articles/new" class="area-new-article">新規作成</a>
    <!-- <edit-header-nav-edit-article v-show="showEditArticleLink"/>
    <edit-header-nav-post-article v-show="showPostArticleLink"/> -->
    <nuxt-link to="/me/articles/public" class="nav-link area-public-articles">公開済</nuxt-link>
    <nuxt-link to="/me/articles/draft" class="nav-link area-drafts">下書き</nuxt-link>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
// import EditHeaderNavEditArticle from '../molecules/EditHeaderNavEditArticle'
// import EditHeaderNavPostArticle from '../molecules/EditHeaderNavPostArticle'

export default {
  components: {
    // EditHeaderNavEditArticle,
    // EditHeaderNavPostArticle
  },
  props: {
    showPostArticleLink: {
      type: Boolean,
      default: false
    },
    showEditArticleLink: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters('article', ['saveStatus'])
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
  max-width: 1080px;
  margin-left: calc(50vw - 540px);
  // padding-left: calc(50vw - 540px);
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

.public-article .area-public-articles,
.public-articles .area-public-articles {
  color: #99a2ff;
  border-bottom: 2px solid #99a2ff;
  margin-top: 2px;
}

.area-drafts {
  grid-area: drafts;
}

.drafts .area-drafts {
  color: #99a2ff;
  border-bottom: 2px solid #99a2ff;
  margin-top: 2px;
}

.area-new-article {
  align-items: center;
  background: linear-gradient(314.72deg, #232538 0%, #858dda 100%);
  border-radius: 4px;
  color: white;
  display: flex;
  font-size: 14px;
  grid-area: new-article;
  justify-content: center;
  text-decoration: none;
}

@media screen and (max-width: 780px) {
  .area-nav {
    grid-template-columns: 64px 56px 42px 108px 1fr 90px 1fr;
    grid-column-gap: 20px;
  }
}

@media screen and (max-width: 640px) {
  .area-save-status,
  .area-new-article {
    display: none;
  }
}

@media screen and (max-width: 550px) {
  .area-nav {
    grid-gap: 20px;
    /* prettier-ignore */
    grid-template-areas:
      'public-articles drafts';
    grid-template-columns: 48px 48px;
    grid-template-rows: 36px;
    text-align: left;
  }

  .public-article .nav-link {
    display: none;
  }

  .nav-link {
    font-size: 12px;
    line-height: 30px;
    text-align: center;
  }

  .public-articles .area-public-articles {
    border-bottom: 1px solid #99a2ff;
  }

  .drafts .area-drafts {
    border-bottom: 1px solid #99a2ff;
  }
}
</style>
