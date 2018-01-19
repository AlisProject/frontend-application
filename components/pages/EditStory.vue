<template>
  <div class="create-story-container">
    <app-header/>
    <editor :title="title" :body="body" :tags="this.$store.state.story.tags"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppHeader from '../organisms/AppHeader'
import Editor from '../atoms/Editor'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    Editor,
    AppFooter
  },
  computed: {
    ...mapGetters('story', ['title', 'body'])
  }
}
</script>

<style lang="scss" scoped>
.create-story-container {
  display: grid;
  grid-template-rows: 100px 50px 650px 75px 75px;
  grid-template-columns: 1fr 640px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    "app-header  app-header app-header"
    "...         ...        ...       "
    "...         editor     ...       "
    "...         ...        ...       "
    "...         app-footer ...       ";
}
</style>
