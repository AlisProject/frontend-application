<template>
  <nav class="area-nav">
    <div class="area-nav-links">
      <nuxt-link
        v-for="topic in topics"
        :key="topic.order"
        :data-topic="topic.name"
        :to="to(topic.name)"
        :class="`nav-link area-topic${topic.order} ${isTopPage(topic.order) && 'nuxt-link-exact-active'}`"
        @click.native="resetData">
        {{topic.display_name}}
      </nuxt-link>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
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
    isTopPage(topicOrder) {
      return this.$route.query.from === 'top' && topicOrder === 1
    },
    ...mapActions('article', ['getTopics', 'resetArticleData']),
    ...mapActions('presentation', ['setArticleListScrollHeight'])
  }
}
</script>

<style lang="scss" scoped>
$topicCount: 5;

.area-nav {
  grid-area: nav;
  display: grid;
  text-align: center;
  grid-template-rows: 1fr 32px 1fr;
  grid-template-columns: 1fr;
  width: 1080px;
  /* prettier-ignore */
  grid-template-areas:
    "...      "
    "nav-links"
    "...      ";
  justify-self: center;
  border-bottom: 1px solid rgba(#6e6e6e, 0.1);
}

.area-nav-links {
  grid-area: nav-links;
  display: grid;
  grid-column-gap: 20px;
  grid-template-columns: repeat($topicCount, fit-content(100%));
  /* prettier-ignore */
  grid-template-areas:
    "topic1 topic2 topic3 topic4 topic5";
}

.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: #6e6e6e;
  white-space: nowrap;

  &.nuxt-link-exact-active {
    display: block;
    color: #858dda;
    border-bottom: 2px solid #99a2ff;
  }
}

@for $i from 1 through $topicCount {
  .area-topic#{$i} {
    grid-area: topic#{$i};
  }
}

@media screen and (max-width: 1080px) {
  .area-nav {
    max-width: calc(100% - 68px);
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
      '... nav-links ...';
    grid-template-rows: 28px;
    grid-template-columns: 0 1fr 0;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
    max-width: 100%;
  }

  .area-nav-links {
    grid-column-gap: 20px;
    overflow: scroll;
    padding-top: 4px;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .nav-link {
    font-size: 10px;

    &.hidden {
      display: none;
    }

    &.nuxt-link-exact-active {
      border-bottom: 1px solid #99a2ff;
    }
  }
}
</style>
