<template>
  <div class="article-container">
    <app-header showDefaultHeaderNav class="logo-original"/>
    <div class="area-story">
      <h1 class="area-title">{{ story.title }}</h1>
      <img class="area-top-image" src="~assets/images/top-story-card-image.png">
      <div class="area-content" v-html="story.body" />
      <story-tags :tags="story.tags"/>
      <story-footer-actions :likesCount="story.likesCount"/>
      <story-side-actions :likesCount="story.likesCount"/>
      <author-info :story="story"/>
      <story-comments :comments="story.comments"/>
    </div>
    <related-stories :stories="story.relatedStories"/>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'
import StoryFooterActions from '../atoms/StoryFooterActions'
import StorySideActions from '../atoms/StorySideActions'
import AuthorInfo from '../atoms/AuthorInfo'
import StoryTags from '../atoms/StoryTags'
import StoryComments from '../organisms/StoryComments'
import RelatedStories from '../organisms/RelatedStories'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    StoryFooterActions,
    StorySideActions,
    AuthorInfo,
    StoryTags,
    StoryComments,
    RelatedStories,
    AppFooter
  },
  props: ['story']
}
</script>

<style lang="scss" scoped>
.article-container {
  display: grid;
  grid-template-rows: 100px 50px 1fr 470px 75px;
  grid-template-columns: 1fr 640px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    'app-header      app-header      app-header     '
    '...             ...             ...            '
    '...             story           ...            '
    'related-stories related-stories related-stories'
    '...             app-footer      ...            ';
  background: white;
}

.area-story {
  display: grid;
  grid-area: story;
  grid-template-rows: auto;
  grid-template-columns: auto;
  grid-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    'title         '
    'top-image     '
    'content       '
    'footer-actions'
    'tags          '
    'author-info   '
    'story-comments';
}

.area-title {
  font-size: 25px;
  grid-area: title;
  letter-spacing: 0.05em;
}

.area-top-image {
  grid-area: top-image;
  max-width: 100%;
  width: 100%;
}

.area-content {
  grid-area: content;
}

@media screen and (max-width: 1080px) {
  .article-container {
    grid-template-rows: 100px 50px 1fr 950px 75px;
  }
}

@media screen and (max-width: 640px) {
  .article-container {
    grid-template-rows: 70px 0 1fr min-content 75px;
    grid-template-columns: 10px 1fr 10px;
    /* prettier-ignore */
    grid-template-areas:
    'app-header      app-header      app-header     '
    '...             ...             ...            '
    'story           story           story          '
    'related-stories related-stories related-stories'
    '...             app-footer      ...            ';
  }

  .area-story {
    grid-template-columns: 8px auto 8px;
    grid-gap: 10px;
    /* prettier-ignore */
    grid-template-areas:
      'top-image      top-image      top-image     '
      '...            title          ...           '
      '...            content        ...           '
      '...            tags           ...           '
      '...            author-info    ...           '
      'footer-actions footer-actions footer-actions'
      '...            story-comments ...           ';
  }

  .area-title {
    font-size: 16px;
    grid-area: title;
    letter-spacing: 0.1em;
  }
}
</style>
