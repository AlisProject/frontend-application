<template>
  <div
    class="area-article-type-select-box"
    :class="{ hidden: showOnlySessionLinksOnPc }"
    v-show="!showOnlyLogo && !showOnlySessionLinks">
    <select required v-model="articleType">
      <option value="popularArticles">人気記事</option>
      <option value="newArticles">新着記事</option>
    </select>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

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
  computed: {
    articleType: {
      get() {
        return this.$store.getters['article/articleType']
      },
      set(value) {
        this.resetArticleData()
        const { fullPath } = this.$route
        const isPopularArticles = value === 'popularArticles'
        this.setArticleType({
          articleType: isPopularArticles ? 'popularArticles' : 'newArticles'
        })
        const to = isPopularArticles
          ? fullPath.replace('recent', 'popular')
          : fullPath.replace('popular', 'recent')
        this.$router.push(to)
      }
    }
  },
  methods: {
    ...mapActions('article', ['resetArticleData', 'setArticleType'])
  }
}
</script>

<style lang="scss" scoped>
.area-article-type-select-box {
  grid-area: article-type-select-box;
  position: relative;
  display: flex;
  align-self: center;

  &::before {
    position: absolute;
    top: 4px;
    right: 0;
    width: 0;
    height: 0;
    padding: 0;
    content: '';
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 8px solid #858dda;
    pointer-events: none;
  }

  select {
    appearance: none;
    background-image: none;
    background: transparent;
    border: none;
    box-shadow: none;
    cursor: pointer;
    outline: none;
    padding-right: 1em;
    text-indent: 0.01px;
    text-overflow: ellipsis;
    width: 100%;
    font-size: 14px;
    color: #858dda;

    &::-ms-expand {
      display: none;
    }
  }

  &.hide-on-pc {
    display: none;
  }
}

@-moz-document url-prefix() {
  .area-article-type-select-box {
    &::before {
      top: 10px !important;
    }
  }
}

@media screen and (max-width: 550px) {
  .area-article-type-select-box {
    &::before {
      top: 6px;
      right: 6px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 7px solid #858dda;
    }

    select {
      font-size: 16px;
      transform: scale(0.6);
      padding-right: 0;
      width: 70px;
      margin: -14px;
    }

    &.hide-on-pc {
      display: block;
    }

    &.hidden {
      display: none;
    }
  }

  @-moz-document url-prefix() {
    .area-article-type-select-box {
      &::before {
        top: 4px !important;
      }
    }
  }
}
</style>
