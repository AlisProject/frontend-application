<template>
  <div class="story-container">
    <app-header/>
    <div class="story">
      <h1 class="title">{{ story.title }}</h1>
      <img class="top-image" src="~assets/images/top-story-card-image.png">
      <div class="content" v-html="story.body" />
      <div class="tags">
        <span class="tag" v-for="tag in story.tags" :key="tag.name">
          {{ tag.name }}
        </span>
      </div>
      <div class="actions">
        <div class="action comment"></div>
        <div class="action bookmark"></div>
        <div class="action twitter"></div>
        <div class="action like"></div>
      </div>
      <author-info :story="story" />
    </div>
    <app-footer/>
  </div>
</template>

<script>
import AppHeader from '../organisms/AppHeader'
import AuthorInfo from '../atoms/AuthorInfo'
import AppFooter from '../organisms/AppFooter'

export default {
  components: {
    AppHeader,
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

.story {
  display: grid;
  grid-area: story;
  grid-template-rows: auto;
  grid-template-columns: auto;
  /* prettier-ignore */
  grid-template-areas:
    'title      '
    'top-image  '
    'content    '
    'actions    '
    'tags       '
    'author-info';
}

.title {
  grid-area: title;
  font-size: 25px;
  letter-spacing: 0.05em;
  margin-bottom: 1.5em;
}

.top-image {
  grid-area: top-image;
  max-width: 100%;
  width: 100%;
  margin-bottom: 3em;
}

.content {
  grid-area: content;
  margin-bottom: 2em;
}

.tags {
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

.actions {
  display: grid;
  grid-area: actions;
  grid-template-rows: 70px;
  grid-template-columns: repeat(4, 60px);
  justify-content: right;

  .action {
    background: white;
    border: 1px solid #fefefe;
    box-shadow: 0px 5px 15px -1px #c1c1c1;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .like {
    background: #ff4949;
    border: 1px solid #ff4949;
    box-shadow: 0px 5px 15px -1px #ff8989;
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>
