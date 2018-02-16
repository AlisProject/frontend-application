<template>
  <div class="create-story-container">
    <app-header showEditHeaderNav showPostStoryLink class="drafts logo-original"/>
    <editor :tags="this.$store.state.story.tags"/>
    <app-footer/>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
    ...mapGetters({
      storyId: 'story/storyId',
      title: 'story/title',
      body: 'story/body'
    })
  },
  methods: {
    ...mapActions('story', ['postNewStory']),
    postStoryAndReplaceUrl: async function() {
      if (location.pathname === '/me/stories/new') {
        // const story = {
        //   title: this.title,
        //   body: this.body
        // }
        // await this.postNewStory({ story })
        await this.postNewStory({})

        history.replaceState('', '', `/me/stories/edit/${this.storyId}`)
      }
    }
  },
  watch: {
    title(newTitle, oldTitle) {
      this.postStoryAndReplaceUrl()
    },
    body(newBody, oldBody) {
      this.postStoryAndReplaceUrl()
    }
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
