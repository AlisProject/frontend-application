<template>
  <nav class="area-nav">
    <span class="area-save-status">{{ saveStatus }}</span>
    <nuxt-link to="/me/articles/public" class="nav-link area-public-articles">公開済み</nuxt-link>
    <nuxt-link to="/me/articles/draft" class="nav-link area-drafts">下書き</nuxt-link>
    <a href="/me/articles/new" class="nav-link area-new-article">新規作成</a>
    <edit-header-nav-edit-article v-show="showEditArticleLink"/>
    <edit-header-nav-post-article v-show="showPostArticleLink"/>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'
import EditHeaderNavEditArticle from '../molecules/EditHeaderNavEditArticle'
import EditHeaderNavPostArticle from '../molecules/EditHeaderNavPostArticle'

export default {
  components: {
    EditHeaderNavEditArticle,
    EditHeaderNavPostArticle
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
  grid-template-rows: 1fr 30px 1fr;
  grid-template-columns: 1fr 70px 70px 70px 1fr 160px 1fr;
  grid-column-gap: 10px;
  /* prettier-ignore */
  grid-template-areas:
    "...          ...             ...    ...         ... ...          ..."
    "save-status  public-articles drafts new-article ... post-article ..."
    "...          ...             ...    ...         ... ...          ...";
}

.area-save-status {
  grid-area: save-status;
  color: #666;
}

.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: #929292;
}

.area-public-articles {
  grid-area: public-articles;
}

.public-article .area-public-articles,
.public-articles .area-public-articles {
  color: #99a2ff;
  display: block;
  border-bottom: 2px solid #99a2ff;
}

.area-drafts {
  grid-area: drafts;
}

.drafts .area-drafts {
  color: #99a2ff;
  display: block;
  border-bottom: 2px solid #99a2ff;
}

.area-new-article {
  grid-area: new-article;
}

.new-article .area-new-article {
  color: #99a2ff;
  display: block;
  border-bottom: 2px solid #99a2ff;
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
