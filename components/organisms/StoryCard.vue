<template>
  <section>
    <a :href="`${getLink}`" class="article-card-container" v-if="linkTo === 'edit'">
      <article-card-image/>
      <story-card-content :story="story"/>
    </a>
    <nuxt-link :to="`${getLink}`" class="article-card-container" v-else>
      <article-card-image/>
      <!-- TODO: data属性からCSSに渡す -->
      <!-- <div class="image" :data-image-url="story.imageUrl"></div> -->
      <story-card-content :story="story"/>
    </nuxt-link>
  </section>
</template>

<script>
import ArticleCardImage from '../atoms/ArticleCardImage'
import StoryCardContent from '../organisms/StoryCardContent'

export default {
  props: {
    story: { type: Object },
    linkTo: {
      type: String
    }
  },
  components: {
    ArticleCardImage,
    StoryCardContent
  },
  computed: {
    getLink() {
      let link = ''
      switch (this.linkTo) {
        case 'edit':
          link = `/me/stories/edit/${this.story.story_id}`
          break
        default:
          link = `/${this.story.user_id}/stories/${this.story.story_id}`
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

.article-card-container {
  display: grid;
  grid-template-rows: 88px 180px;
  grid-template-columns: 340px;
  /* prettier-ignore */
  grid-template-areas:
    "article-card-image"
    "article-card-content";
}

.top {
  grid-column: 1 / 4;
}

.long-article-card {
  .top {
    grid-column: auto;
  }

  .article-card-container {
    grid-area: long-article-card;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 270px;
    /* prettier-ignore */
    grid-template-areas:
      "long-article-card-image long-article-card-content";
  }
}

.draft .article-card-container {
  opacity: 0.7;
}

@media screen and (max-width: 1296px) {
  .long-article-card {
    .article-card-container {
      grid-template-rows: 178px;
    }
  }

  .top {
    grid-column: 1 / 3;
  }
}

@media screen and (max-width: 920px) {
  .long-article-card {
    .article-card-container {
      grid-template-rows: 88px 180px;
      grid-template-columns: 340px;
      /* prettier-ignore */
      grid-template-areas:
        "article-card-image"
        "article-card-content";
    }
  }

  .top {
    grid-column: auto;
  }
}

@media screen and (max-width: 550px) {
  .long-article-card {
    .article-card-container {
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      box-shadow: 0 4px 10px 0 rgba(192, 192, 192, 0.5);
      grid-template-columns: 1fr;
      grid-template-rows: 120px 180px;
    }
  }

  .article-card-container {
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
    box-shadow: 0 4px 10px 0 rgba(192, 192, 192, 0.5);
    grid-template-columns: 1fr;
    grid-template-rows: 120px 180px;
  }
}
</style>
