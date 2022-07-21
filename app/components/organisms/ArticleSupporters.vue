<template>
  <div class="area-article-sub-infos-container">
    <div
      class="supporters-wrapper"
      :class="{ 'is-show': hasSupporter, 'is-over': isSupporterShowCountOver }"
    >
      <div v-if="hasSupporter" class="area-supporter-icons">
        <nuxt-link
          v-for="supporter in filterShowSupporters"
          :key="supporter.user_id"
          :to="`/users/${supporter.user_id}`"
          class="supporter"
        >
          <img
            v-if="supporter.icon_image_url"
            class="user-icon"
            :src="supporter.icon_image_url | addOptimizeParamToImageUrl('48x48')"
            alt="Supporter profile icon"
          >
          <img
            v-else
            class="user-icon"
            src="~assets/images/pc/common/icon_user_noimg.png"
            alt="Supporter profile icon"
          >
        </nuxt-link>
        <nuxt-link
          v-if="supporters.length > supporterShowCount"
          class="supporter"
          :class="{ 'is-show': hasOverSupportersShowCount }"
          :to="`/${article.user_id}/articles/${article.article_id}/supporters`"
        >
          <img
            src="~assets/images/pc/article/icon_all_supporters.svg"
            class="user-icon"
            alt="Supporters link icon"
          >
        </nuxt-link>
      </div>
      <div class="area-supporters-count">
        <img class="icon" src="~assets/images/pc/article/icon_article_tip.png" alt="Article tip">
        <span class="count-text">
          <span class="count">{{ supporters.length }}</span>人がサポートしています
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatTokenAmount, addOptimizeParamToImageUrl } from '~/utils/article'

export default {
  props: {
    article: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      windowWidth: 0
    }
  },
  mounted() {
    this.updateWidth()
    window.addEventListener('resize', this.updateWidth)
  },
  computed: {
    isSupporterShowCountOver() {
      return this.supporters.length >= this.supporterShowCount
    },
    supporterShowCount() {
      return this.windowWidth <= 640 ? 5 : 8
    },
    filterShowSupporters() {
      const removeCount = this.supporters.length > this.supporterShowCount ? 1 : 0
      return this.supporters.slice(0, this.supporterShowCount - removeCount)
    },
    hasSupporter() {
      return this.supporters.length > 0
    },
    hasOverSupportersShowCount() {
      return this.supporters.length > this.supporterShowCount
    },
    ...mapGetters('article', ['supporters'])
  },
  methods: {
    updateWidth() {
      this.windowWidth = window.innerWidth
    }
  },
  filters: {
    formatTokenAmount,
    addOptimizeParamToImageUrl
  }
}
</script>

<style lang="scss" scoped>
.area-article-sub-infos-container {
  grid-area: article-supporters;
}

.supporters-wrapper {
  border: 1px solid #0086cc;
  border-radius: 8px;
  background-color: #fff;
  width: 100%;
  position: relative;
  display: none;
  &.is-show {
    display: grid;
  }
  &.is-over {
    grid-template-areas:
      'supporter-icons'
      'supporters-count';
  }
  /* prettier-ignore */
  grid-template-areas:
    "supporter-icons supporters-count";
  grid-gap: 2px;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin-bottom: 10px;
  padding: 15px 0;
}

.area-supporter-icons {
  grid-area: supporter-icons;
  .user-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 5px;
  }
}

.area-supporters-count {
  grid-area: supporters-count;
  font-size: 14px;
  text-align: center;
  .count-text {
    vertical-align: -3px;
    .count {
      font-weight: bold;
    }
  }

  .icon {
    vertical-align: -6px;
    width: 20px;
  }
}

@media screen and (max-width: 640px) {
  .supporters {
    width: calc(100vw - 46px);
    margin: 16px 0 20px;
  }
  .supporters-wrapper {
    grid-template-areas: 'supporter-icons' 'supporters-count';
  }
}

/* 「もっと見る」がぶつかる横幅 */
@media screen and (max-width: 524px) {
  .link {
    top: 50px;
    left: calc(100vw - 80px);
    white-space: nowrap;
  }
}
</style>
