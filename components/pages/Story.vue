<template>
  <div class="story-container">
    <app-header showDefaultHeaderNav/>
    <div class="area-story">
      <h1 class="area-title">{{ story.title }}</h1>
      <img class="area-top-image" src="~assets/images/top-story-card-image.png">
      <div class="area-content" v-html="story.body" />
      <div class="area-tags">
        <span class="tag" v-for="tag in story.tags" :key="tag.name">
          {{ tag.name }}
        </span>
      </div>
      <story-footer-actions/>
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
import AuthorInfo from '../atoms/AuthorInfo'
import StoryComments from '../organisms/StoryComments'
import RelatedStories from '../organisms/RelatedStories'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    StoryFooterActions,
    AuthorInfo,
    StoryComments,
    RelatedStories,
    AppFooter
  },
  props: ['story']
}
</script>

<style lang="scss" scoped>
.story-container {
  display: grid;
  grid-template-rows: 100px 50px 1fr 470px 75px;
  grid-template-columns: 1fr 642px 1fr;
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
  font-family: YuGothic;
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

.area-tags {
  grid-area: tags;
}

.tag {
  background: #eee;
  border-radius: 4px;
  color: #4c4c4c;
  display: inline-block;
  font-family: YuGothic;
  font-size: 14px;
  line-height: 12px;
  margin: 0.2em;
  padding: 0.4em 1.5em;
}
</style>
