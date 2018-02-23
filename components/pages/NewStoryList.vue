<template>
  <div class="new-article-list-container">
    <app-header showDefaultHeaderNav class="new-stories logo-white"/>
    <story-card-list :stories="stories"/>
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
      stories: 'story/newStories'
    })
  }
}
</script>

<style lang="scss" scoped>
.new-article-list-container {
  background: url('~assets/images/pc/bg/bg_top.png') no-repeat;
  background-color: #f7f7f7;
  background-size: contain;
  display: grid;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header       app-header"
    "...         ...              ...       "
    "...         story-card-list  ...       "
    "...         ...              ...       "
    "app-footer  app-footer       app-footer";
  grid-template-columns: 1fr 1080px 1fr;
  grid-template-rows: 100px 190px 1fr 75px 75px;
}

@media screen and (max-width: 1296px) {
  .new-article-list-container {
    grid-template-columns: 1fr 710px 1fr;
  }
}

@media screen and (max-width: 920px) {
  .new-article-list-container {
    grid-template-columns: 1fr 340px 1fr;
  }
}

@media screen and (max-width: 550px) {
  .new-article-list-container {
    background: #f7f7f7;
    grid-template-rows: 100px 15px 1fr 75px 75px;
    grid-template-columns: 1fr 350px 1fr;
  }
}

@media screen and (max-width: 370px) {
  .new-article-list-container {
    grid-template-columns: 10px 1fr 10px;
  }
}
</style>
