<template>
  <div
    class="area-article-type-select-box"
    :class="{ hidden: showOnlySessionLinksOnPc }"
    v-show="!showOnlyLogo && !showOnlySessionLinks">
    <select required @change="onChangeArticleTypeSelect" v-model="articleType">
      <option value="popularArticles">人気記事</option>
      <option value="newArticles">新着記事</option>
    </select>
  </div>
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
  mounted() {
    const { fullPath } = this.$route
    const isPopularArticlesPage = fullPath.startsWith('/articles/popular') || fullPath === '/'
    this.setArticleType({ articleType: isPopularArticlesPage ? 'popularArticles' : 'newArticles' })

    const areaArticleTypeSelectBox = document.querySelector('.area-article-type-select-box')
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    areaArticleTypeSelectBox.addEventListener('touchstart', (event) => {
      viewportMeta.setAttribute('content', 'width=device-width,initial-scale=1,user-scalable=0')
    })
    areaArticleTypeSelectBox.addEventListener('blur', (event) => {
      viewportMeta.setAttribute('content', 'width=device-width,initial-scale=1')
    })
  },
  computed: {
    ...mapGetters('article', ['articleType'])
  },
  methods: {
    onChangeArticleTypeSelect(event) {
      this.resetArticleData()
      const { fullPath } = this.$route
      if (fullPath === '/') {
        this.$router.push('/articles/recent?topic=crypto')
        return
      }
      const isPopularArticles = event.target.value === 'popularArticles'
      this.setArticleType({
        articleType: isPopularArticles ? 'popularArticles' : 'newArticles'
      })
      const to = isPopularArticles
        ? fullPath.replace('recent', 'popular')
        : fullPath.replace('popular', 'recent')
      this.$router.push(to)
    },
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
    -webkit-appearance: none;
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
}

@media screen and (max-width: 550px) {
  .area-article-type-select-box {
    &::before {
      top: 2px;
      right: 6px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 7px solid #858dda;
    }

    select {
      font-size: 10px;
    }

    &.hidden {
      display: none;
    }
  }
}
</style>
