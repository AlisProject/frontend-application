<template>
  <nav class="area-nav">
    <div class="area-nav-links">
      <nuxt-link
        to="/"
        class="nav-link area-topic0">
        <span class="topic-display-name">
          オススメ
        </span>
      </nuxt-link>
      <nuxt-link
        v-for="topic in topics"
        :key="topic.order"
        :data-topic="topic.name"
        :style="`background-image: url(topic/topic_${topic.name}.png)`"
        :to="to(topic.name)"
        :class="`nav-link area-topic${topic.order} ${isTopPage(topic.order) && 'nuxt-link-exact-active'}`"
        @click.native="resetData">
        <span class="topic-display-name">
          {{topic.display_name}}
        </span>
      </nuxt-link>
      <nuxt-link
        v-for="topic in topics"
        :key="topic.order + 5"
        :data-topic="topic.name"
        :style="`background-image: url(topic/topic_${topic.name}.png)`"
        :to="to(topic.name)"
        :class="`nav-link area-topic${topic.order + 5} ${isTopPage(topic.order) && 'nuxt-link-exact-active'}`"
        @click.native="resetData">
        <span class="topic-display-name">
          {{topic.display_name}}
        </span>
      </nuxt-link>
    </div>
  </nav>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { ADD_TOAST_MESSAGE } from 'vuex-toast'

const pcHeaderHeight = 100
const spHeaderHeight = 66

export default {
  data() {
    return {
      beforeClickedLinkName: this.$route.query.topic,
      fixNavigationHeight: pcHeaderHeight
    }
  },
  async created() {
    if (this.topics.length !== 0) return
    try {
      await this.getTopics()
    } catch (error) {
      this.sendNotification({
        text: 'エラーが発生しました。しばらく時間を置いて再度お試しください',
        type: 'warning'
      })
    }
  },
  computed: {
    ...mapGetters('article', ['topics', 'articleType'])
  },
  mounted() {
    this.handleResize()
    window.addEventListener('resize', this.handleResize)
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleResize)
    window.removeEventListener('scroll', this.handleScroll)
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
    handleScroll() {
      const navElement = this.$el
      if (window.scrollY >= this.fixNavigationHeight) {
        navElement.classList.add('is-fixed')
      } else {
        navElement.classList.remove('is-fixed')
      }
      this.startPos = this.currentPos
    },
    handleResize() {
      const spBreakPoint = 550
      this.fixNavigationHeight = window.innerWidth <= spBreakPoint ? spHeaderHeight : pcHeaderHeight
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', ['getTopics', 'resetArticleData']),
    ...mapActions('presentation', ['setArticleListScrollHeight'])
  }
}
</script>

<style lang="scss" scoped>
$topicCount: 11;

.area-nav {
  grid-area: nav;
  display: grid;
  text-align: center;
  grid-template-rows: auto;
  grid-template-columns: auto;
  /* prettier-ignore */
  grid-template-areas:
    "nav-links";
  justify-self: center;
  z-index: 2000;
  background: #fff;

  &.is-fixed {
    transition: all 400ms ease;
    width: 100%;
    padding: 12px 0;
    position: fixed;
    box-shadow: 0 0 12px 0 rgba(192, 192, 192, 0.7);
    /* prettier-ignore */
    grid-template-areas:
      '... nav-links ...';
    grid-template-columns: 1fr auto 1fr;

    .nav-link {
      height: 28px;

      .topic-display-name {
        bottom: 7px;
      }

      &.nuxt-link-exact-active {
        border-radius: 1px;
        height: 22px;
        width: 90px;

        .topic-display-name {
          bottom: 5px;
        }
      }
    }
  }
}

.area-nav-links {
  grid-area: nav-links;
  display: grid;
  grid-column-gap: 12px;
  grid-template-columns: repeat($topicCount, 96px);
  /* prettier-ignore */
  grid-template-areas:
    "topic0 topic1 topic2 topic3 topic4 topic5 topic6 topic7 topic8 topic9 topic10 topic11";
  overflow: scroll;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}

.nav-link {
  font-size: 12px;
  text-decoration: none;
  color: #fff;
  white-space: nowrap;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  box-sizing: border-box;
  position: relative;
  height: 50px;
  width: 96px;

  .topic-display-name {
    bottom: 10px;
    left: 0;
    position: absolute;
    right: 0;
  }

  &.nuxt-link-exact-active {
    border-radius: 1px;
    box-shadow: 0 0 0 1px #fff, 0 0 0 3px #0086cc;
    display: block;
    height: 44px;
    margin: 3px 2px 0 2px;
    width: 90px;

    .topic-display-name {
      bottom: 7px;
    }
  }
}

.area-topic0 {
  background-image: url('~assets/images/pc/topic/recommended_topic.png');
}

@for $i from 1 through $topicCount {
  .area-topic#{$i} {
    grid-area: topic#{$i};
  }
}

@media screen and (max-width: 1180px) {
  .area-nav {
    justify-self: flex-start;
    padding-left: 12px;

    &.is-fixed {
      padding-left: 12px;
    }
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
    grid-gap: 12px;
    /* prettier-ignore */
    grid-template-areas:
      '... nav-links ...';
    grid-template-columns: 0 auto 0;
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.15);
    max-width: 100%;
    margin-bottom: 0;
    padding: 0 0 12px 0;

    &.is-fixed {
      padding-left: 0;

      @supports (-webkit-overflow-scrolling: touch) {
        padding: 16px 0 0 0;
      }
    }
  }

  .area-nav-links {
    padding: 0;
  }
}
</style>
