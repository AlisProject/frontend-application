<template>
  <div class="draft-article-list-container long-article-card">
    <app-header showEditHeaderNav class="drafts logo-original"/>
    <story-card-list :stories="stories" class="draft" :linkTo="'edit'"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import StoryCardList from '../organisms/StoryCardList'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    StoryCardList,
    AppFooter
  },
  computed: {
    ...mapGetters({
      stories: 'story/draftStories'
    })
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
    "app-header  app-header       app-header"
    "...         ...              ...       "
    "...         story-card-list  ...       "
    "...         ...              ...       "
    "app-footer  app-footer       app-footer";
  background: #f7f7f7;
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
    grid-template-columns: 1fr 350px 1fr;
  }
}

@media screen and (max-width: 370px) {
  .draft-article-list-container {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
