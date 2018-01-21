<template>
  <section>
    <a :href="`${getLink}`" class="story-card-container" v-if="linkTo === 'edit'">
      <story-card-image/>
      <story-card-content :story="story"/>
    </a>
    <nuxt-link :to="`${getLink}`" class="story-card-container" v-else>
      <story-card-image/>
      <!-- TODO: data属性からCSSに渡す -->
      <!-- <div class="image" :data-image-url="story.imageUrl"></div> -->
      <story-card-content :story="story"/>
    </nuxt-link>
  </section>
</template>

<script>
import StoryCardImage from '../atoms/StoryCardImage'
import StoryCardContent from '../atoms/StoryCardContent'

export default {
  props: {
    story: { type: Object },
    linkTo: {
      type: String
    }
  },
  components: {
    StoryCardImage,
    StoryCardContent
  },
  computed: {
    getLink() {
      let link = ''
      switch (this.linkTo) {
        case 'edit':
          link = `/stories/edit/${this.story.id}`
          break
        default:
          link = `/${this.story.user.username}/stories/${this.story.id}`
      }
      return link
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
}

.story-card-container {
  display: grid;
  grid-template-rows: 88px 180px;
  grid-template-columns: 340px;
  /* prettier-ignore */
  grid-template-areas:
    "story-card-image"
    "story-card-content";
}

.top {
  grid-column: 1 / 4;
}

.long-story-card {
  .top {
    grid-column: auto;
  }

  .story-card-container {
    grid-area: long-story-card;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 270px;
    /* prettier-ignore */
    grid-template-areas:
      "long-story-card-image long-story-card-content";
  }
}

.draft .story-card-container {
  opacity: 0.7;
}
</style>
