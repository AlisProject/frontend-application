<template>
  <div class="story-container">
    <app-header/>
    <div class="area-story">
      <h1 class="area-title">{{ story.title }}</h1>
      <img class="area-top-image" src="~assets/images/top-story-card-image.png">
      <div class="area-content" v-html="story.body" />
      <div class="area-tags">
        <span class="tag" v-for="tag in story.tags" :key="tag.name">
          {{ tag.name }}
        </span>
      </div>
      <footer-actions/>
      <author-info :story="story"/>
    </div>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'
import FooterActions from '../atoms/FooterActions'
import AuthorInfo from '../atoms/AuthorInfo'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
    FooterActions,
    AuthorInfo,
    AppFooter
  },
  props: ['story']
}
</script>

<style lang="scss" scoped>
.story-container {
  display: grid;
  grid-template-rows: 100px 50px 1fr 75px 75px;
  grid-template-columns: 1fr 642px 1fr;
  /* prettier-ignore */
  grid-template-areas:
    'app-header app-header  app-header'
    '...        ...         ...       '
    '...        story       ...       '
    '...        ...         ...       '
    '...        app-footer  ...       ';
  background: white;
}

.area-story {
  display: grid;
  grid-area: story;
  grid-template-rows: auto;
  grid-template-columns: auto;
  /* prettier-ignore */
  grid-template-areas:
    'title         '
    'top-image     '
    'content       '
    'footer-actions'
    'tags          '
    'author-info   ';
}

.area-title {
  grid-area: title;
  font-size: 25px;
  letter-spacing: 0.05em;
  margin-bottom: 1.5em;
}

.area-top-image {
  grid-area: top-image;
  max-width: 100%;
  width: 100%;
  margin-bottom: 3em;
}

.area-content {
  grid-area: content;
  margin-bottom: 2em;
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
