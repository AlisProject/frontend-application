<template>
  <div class="draft-article-list-container long-article-card" @scroll="infiniteScroll">
    <app-header showEditHeaderNav class="drafts logo-original"/>
    <article-card-list :articles="draftArticles" class="draft" :linkTo="'draft'"/>
    <the-loader :lastEvaluatedKey="draftArticlesLastEvaluatedKey"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import ArticleCardList from '../organisms/ArticleCardList'
import TheLoader from '../atoms/TheLoader'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    ArticleCardList,
    TheLoader,
    AppFooter
  },
  mounted() {
    this.setIsSaving({ isSaving: false })
    this.setIsSaved({ isSaved: false })
  },
  computed: {
    ...mapGetters('article', ['draftArticles', 'draftArticlesLastEvaluatedKey'])
  },
  methods: {
    infiniteScroll(event) {
      if (event.target.scrollTop + event.target.offsetHeight >= event.target.scrollHeight - 10) {
        this.getDraftArticles()
      }
    },
    ...mapActions('article', ['getDraftArticles', 'setIsSaving', 'setIsSaved'])
  }
}
</script>

<style lang="scss" scoped>
.draft-article-list-container {
  display: grid;
  grid-template-rows: 100px 40px 1fr 75px 75px;
  grid-template-columns: 1fr 1080px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header        app-header"
    "...         ...               ...       "
    "...         article-card-list ...       "
    "...         loader            ...       "
    "app-footer  app-footer        app-footer";
  background: #f7f7f7;
  height: 100vh;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

@media screen and (max-width: 1296px) {
  .draft-article-list-container {
    grid-template-columns: 1fr 710px 1fr;
  }
}

@media screen and (max-width: 920px) {
  .draft-article-list-container {
    grid-template-columns: 1fr 340px 1fr;
  }
}

@media screen and (max-width: 550px) {
  .draft-article-list-container {
    grid-template-rows: 100px 40px 1fr 75px min-content;
    grid-template-columns: 1fr 350px 1fr;
  }
}

@media screen and (max-width: 370px) {
  .draft-article-list-container {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
