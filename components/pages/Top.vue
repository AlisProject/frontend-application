<template>
  <div class="top-container">
    <app-header/>
    <story-card-list :stories="stories"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import StoryCardList from '../organisms/StoryCardList'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    StoryCardList,
    AppFooter
  },
  computed: mapState(['stories'])
}
</script>

<style lang="scss" scoped>
.top-container {
  display: grid;
  grid-template-rows: 100px 190px 1fr 75px 75px;
  grid-template-columns: 1fr 1082px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header       app-header"
    "...         ...              ...       "
    "...         story-card-list  ...       "
    "...         ...              ...       "
    "...         app-footer       ...       ";
  background: linear-gradient(155deg, #99a1fb 0%, #99a1fb 32.5%, #f7f7f7 32.5%, #f7f7f7 100%);
}
</style>

