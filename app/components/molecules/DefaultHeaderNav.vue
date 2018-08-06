<template>
  <nav class="area-nav">
    <template v-if="!showOnlyLogo && !showOnlySessionLinks">
      <nuxt-link
        v-for="topic in topics"
        :key="topic.order"
        :data-topic="topic.name"
        :to="to(topic.name)"
        :class="`nav-link area-topic${topic.order} ${showOnlySessionLinksOnPc ? 'hidden' : ''}`"
        @click.native="resetScrollHeight">
        {{topic.display_name}}
      </nuxt-link>
    </template>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    showOnlyLogo: {
      type: Boolean,
      default: false
    },
    showOnlySessionLinks: {
      type: Boolean,
      default: false
    },
    showOnlySessionLinksOnPc: {
      type: Boolean,
      default: false
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
      switch (this.$route.fullPath) {
        case '/':
          return { path: '/articles/popular', query: { topic } }
        case '/me/notifications':
          const to = this.articleType === 'popularArticles' ? 'popular' : 'recent'
          return { path: `/articles/${to}`, query: { topic } }
        default:
          return { query: { topic } }
      }
    },
    resetScrollHeight() {
      this.setArticleListScrollHeight({ scroll: 0 })
    },
    ...mapActions('article', ['getTopics']),
    ...mapActions('presentation', ['setArticleListScrollHeight'])
  }
}
</script>

<style lang="scss" scoped>
.area-nav {
  grid-area: nav;
  display: grid;
  text-align: center;
  grid-template-rows: 1fr 22px 1fr;
  grid-template-columns: 1fr repeat(3, 90px) 1fr;
  grid-column-gap: 30px;
  /* prettier-ignore */
  grid-template-areas:
    "... ...    ...    ...    ..."
    "... topic1 topic2 topic3 ..."
    "... ...    ...    ...    ...";
}

.nav-link {
  font-size: 14px;
  text-decoration: none;
  color: #6e6e6e;
  padding: 0 10px;
  line-height: 1.6;
}

.area-topic1 {
  grid-area: topic1;
}

.area-topic2 {
  grid-area: topic2;
}

.area-topic3 {
  grid-area: topic3;
}

.topic1 .area-topic1,
.topic2 .area-topic2,
.topic3 .area-topic3 {
  color: white;
  display: block;
  background: #858dda;
  border-radius: 10px;
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
      'topic1 topic2 topic3';
    grid-template-rows: 20px;
    grid-template-columns: repeat(3, fit-content(100%));
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
</style>
