<template>
  <nav class="area-nav">
    <div class="area-nav-links" @scroll="handleHorizontalScroll">
      <nuxt-link to="/" class="nav-link area-topic0" @click.native="initTopPage">
        <span class="topic-display-name">
          オススメ
        </span>
      </nuxt-link>
      <nuxt-link
        v-for="topic in topics"
        :key="topic.order"
        :data-topic="topic.name"
        :style="`background-image: url(${topicImages[topic.name]})`"
        :to="to(topic.name)"
        :class="
          `nav-link area-topic${topic.order} ${isTopPage(topic.order) && 'nuxt-link-exact-active'}`
        "
        @click.native="resetData"
      >
        <span class="topic-display-name">
          {{ topic.display_name }}
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
    topicImages() {
      const images = {}
      this.topics.forEach((topic) => {
        images[topic.name] = require(`~/assets/images/pc/topic/topic_${topic.name}.png`)
      })
      return images
    },
    ...mapGetters('article', ['topics', 'articleType']),
    ...mapGetters('presentation', ['defaultHeaderNavHorizontalScrollPosition'])
  },
  mounted() {
    this.holdHorizontalScrollPosition()
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
    initTopPage() {
      // 同一ページからの遷移の場合は記事の初期化は行わない
      if (this.$route.path !== '/') {
        this.resetArticleData()
      }
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
      }
      if (window.scrollY < this.fixNavigationHeight - 22) {
        navElement.classList.remove('is-fixed')
      }
      this.startPos = this.currentPos
    },
    handleHorizontalScroll(event) {
      this.setDefaultHeaderNavHorizontalScrollPosition({ scrollPosition: event.target.scrollLeft })
    },
    handleResize() {
      const spBreakPoint = 550
      this.fixNavigationHeight = window.innerWidth <= spBreakPoint ? spHeaderHeight : pcHeaderHeight
    },
    holdHorizontalScrollPosition() {
      this.$el.querySelector(
        '.area-nav-links'
      ).scrollLeft = this.defaultHeaderNavHorizontalScrollPosition
    },
    ...mapActions({
      sendNotification: ADD_TOAST_MESSAGE
    }),
    ...mapActions('article', ['getTopics', 'resetArticleData']),
    ...mapActions('presentation', [
      'setArticleListScrollHeight',
      'setDefaultHeaderNavHorizontalScrollPosition'
    ])
  },
  watch: {
    async $route() {
      await this.$nextTick()
      this.holdHorizontalScrollPosition()
    }
  }
}
</script>

<style lang="scss" scoped>
$topicCount: 10;

.area-nav {
  -moz-osx-font-smoothing: auto;
  -webkit-font-smoothing: auto;
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
    width: 100%;
    padding: 12px 0;
    position: fixed;
    box-shadow: 0 0 12px 0 rgba(192, 192, 192, 0.7);
    /* prettier-ignore */
    grid-template-areas:
      '... nav-links ...';
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);

    .nav-link {
      height: 28px;

      &.area-topic0 {
        &:before {
          background: none;
        }
      }

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
  grid-column-gap: 8px;
  grid-template-columns: repeat($topicCount, 91px);
  /* prettier-ignore */
  grid-template-areas:
    "topic0 topic1 topic2 topic3 topic4 topic5 topic6 topic7 topic8 topic9 topic10";
  overflow: scroll;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.nav-link {
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 4px;
  box-sizing: border-box;
  color: #fff;
  font-size: 12px;
  font-weight: bold;
  height: 50px;
  position: relative;
  text-decoration: none;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
  white-space: nowrap;
  width: 91px;

  &:before {
    content: '';
    border-radius: 4px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
  }

  .topic-display-name {
    bottom: 6px;
    left: 0;
    position: absolute;
    right: 0;
  }

  &.nuxt-link-exact-active {
    border-radius: 1px;
    box-shadow: 0 0 0 1px #fff, 0 0 0 3px #0086cc;
    display: block;
    height: 44px;
    margin: 3px 3px 0;
    width: 85px;

    .topic-display-name {
      bottom: 5px;
    }

    &:before {
      background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.5) 100%);
    }

    &:after {
      position: absolute;
      top: 0;
      left: 100%;
      width: 3px;
      height: 1px;
      content: '';
    }

    &.area-topic0 {
      &:before {
        background-position-x: 20px;
        background-position-y: 5px;
      }
    }
  }

  &.area-topic0 {
    background-color: #0086cc;

    &:before {
      background-image: none;
      background: url('~assets/images/pc/topic/icon_category_recomend.png') no-repeat;
      background-size: 48px;
      background-position-x: 22px;
      background-position-y: 7px;
    }
  }
}

@for $i from 1 through $topicCount {
  .area-topic#{$i} {
    grid-area: topic#{$i};
  }
}

@media screen and (max-width: 1080px) {
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
    max-width: 100%;
    margin-bottom: 0;
    padding: 0;

    &.is-fixed {
      padding-left: 0;

      @supports (-webkit-overflow-scrolling: touch) {
        padding: 10px 0;
      }
    }
  }

  .area-nav-links {
    padding: 0;
    grid-gap: 6px;
  }
}
</style>
