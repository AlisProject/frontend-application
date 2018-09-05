<template>
  <nav class="area-nav">
    <nuxt-link
      v-for="topic in topics"
      :key="topic.order"
      :data-topic="topic.name"
      :to="to(topic.name)"
      :class="`nav-link area-topic${topic.order}`"
      @click.native="resetData">
      {{topic.display_name}}
    </nuxt-link>
    <article-type-select-box />
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import ArticleTypeSelectBox from '../molecules/ArticleTypeSelectBox'

export default {
  components: {
    ArticleTypeSelectBox
  },
  data() {
    return {
      beforeClickedLinkName: this.$route.query.topic
    }
  },
  async created() {
    if (this.topics.length !== 0) return
    await this.getTopics()
  },
  computed: {
    ...mapGetters('article', ['topics', 'articleType'])
  },
  methods: {
    to(topic) {
      const to = this.articleType === 'popularArticles' ? 'popular' : 'recent'
      return { path: `/articles/${to}`, query: { topic } }
    },
    resetData(event) {
      // 同一のページの場合は記事情報をリセットしない
      if (this.beforeClickedLinkName === event.target.dataset.topic) return
      this.resetArticleData()
      this.setArticleListScrollHeight({ scroll: 0 })
      this.beforeClickedLinkName = event.target.dataset.topic
    },
    ...mapActions('article', ['getTopics', 'resetArticleData']),
    ...mapActions('presentation', ['setArticleListScrollHeight'])
  }
}
</script>

<style lang="scss" scoped>
$topicCount: 3;

.area-nav {
  grid-area: nav;
  display: grid;
  text-align: center;
  grid-template-rows: 1fr 22px 1fr;
  grid-template-columns: 1fr repeat($topicCount, fit-content(100%)) 0 70px 1fr;
  grid-column-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    "... ...    ...    ...    ... ...                     ..."
    "... topic1 topic2 topic3 ... article-type-select-box ..."
    "... ...    ...    ...    ... ...                     ...";
}

.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: #6e6e6e;
  padding: 0 10px;
  line-height: 1.6;
  white-space: nowrap;
}

@for $i from 1 through $topicCount {
  .area-topic#{$i} {
    grid-area: topic#{$i};
  }

  .topic#{$i} .area-topic#{$i} {
    color: white;
    display: block;
    background: #858dda;
    border-radius: 10px;
  }
}

@media screen and (max-width: 920px) {
  .article-container {
    .nav-link {
      display: none;
    }
  }
}

@media screen and (max-width: 670px) {
  .area-nav {
    grid-column-gap: 10px;
  }
}

@media screen and (max-width: 550px) {
  .area-nav {
    grid-gap: 14px;
    /* prettier-ignore */
    grid-template-areas:
      'topic1 topic2 topic3 ... article-type-select-box';
    grid-template-rows: 20px;
    grid-template-columns: repeat($topicCount, fit-content(100%)) 1fr 62px;
    padding: 0 18px;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
  }

  .nav-link {
    font-size: 10px;
    padding: 0 9px;
    line-height: 2;

    &.hidden {
      display: none;
    }
  }
}

@media screen and (max-width: 320px) {
  .area-nav {
    grid-gap: 2px;
  }
}
</style>
