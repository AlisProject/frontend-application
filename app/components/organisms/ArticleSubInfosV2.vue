<template>
  <div class="area-article-sub-infos-container">
    <div class="article-sub-infos">
      <div class="icons">
        <img class="icon" src="~assets/images/pc/article/icon_article_date.png">
        <img class="icon" src="~assets/images/pc/article/icon_article_like.png">
        <img class="icon" src="~assets/images/pc/article/icon_article_tip.png">
        <img
          class="icon"
          :class="{ 'visibility-hidden': !hasSupporter }"
          src="~assets/images/pc/article/icon_article_supporter.png"
        >
      </div>
      <div class="titles">
        <span class="title">公開日</span>
        <span class="title">いいねによる獲得</span>
        <span class="title">投げ銭による獲得</span>
        <span class="title" :class="{ 'visibility-hidden': !hasSupporter }">サポーター</span>
      </div>
      <div class="separators">
        <span class="separator">:</span>
        <span class="separator">:</span>
        <span class="separator">:</span>
      </div>
      <div class="values">
        <span class="value">{{ formattedPublishedAt }}</span>
        <span class="value">{{ article.alisToken | formatTokenAmount }} ALIS</span>
        <span class="value">{{ article.tip_value | formatTokenAmount }} ALIS</span>
      </div>
    </div>
    <div class="supporters-wrapper">
      <div v-if="hasSupporter" class="supporters">
        <nuxt-link
          v-for="(supporter, i) in filter10Supporters"
          :key="supporter.user_id"
          :to="`/users/${supporter.user_id}`"
          class="supporter"
        >
          <img
            v-if="supporter.icon_image_url"
            :class="`user-icon rank${i + 1}`"
            :src="`${supporter.icon_image_url}?d=48x48`"
          >
          <img
            v-else
            :class="`user-icon rank${i + 1}`"
            src="~assets/images/pc/common/icon_user_noimg.png"
          >
        </nuxt-link>
      </div>
      <nuxt-link
        class="link"
        :class="{ 'is-show': hasOver10Supporters }"
        :to="`/${article.user_id}/articles/${article.article_id}/supporters`"
      >
        もっと見る
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { formatDate } from '~/utils/format'
import { formatTokenAmount } from '~/utils/article'

export default {
  props: {
    article: {
      type: Object,
      required: true
    },
    publishedAt: {
      type: Number,
      required: true
    }
  },
  computed: {
    formattedPublishedAt() {
      return formatDate(this.publishedAt)
    },
    filter10Supporters() {
      return this.supporters.slice(0, 10)
    },
    hasSupporter() {
      return this.supporters.length > 0
    },
    hasOver10Supporters() {
      return this.supporters.length >= 10
    },
    ...mapGetters('article', ['supporters'])
  },
  filters: {
    formatTokenAmount
  }
}
</script>

<style lang="scss" scoped>
.area-article-sub-infos-container {
  grid-area: article-sub-infos;
}

.article-sub-infos {
  display: flex;
  margin-top: 10px;
}

.icons,
.titles,
.separators,
.values {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 78px;
  margin-right: 8px;
}

.icons,
.titles {
  height: 106px;
}

.icon {
  width: 20px;
}

.visibility-hidden {
  visibility: hidden;
}

.title,
.separator {
  color: #6e6e6e;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
}

.value {
  color: #030303;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.4px;
  text-align: right;
}

.supporters-wrapper {
  width: 100%;
  position: relative;
}

.supporters {
  display: flex;
  margin: 16px 0 40px;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
  padding: 5px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.user-icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;

  &.rank1,
  &.rank2 {
    margin-right: 18px;
  }

  &.rank3 {
    margin-right: 14px;
  }

  &.rank1 {
    box-shadow: 0 0 0 4px #fff, 0 0 0 5px #efdd52;
  }

  &.rank2 {
    box-shadow: 0 0 0 4px #fff, 0 0 0 5px #b5b5b5;
  }

  &.rank3 {
    box-shadow: 0 0 0 4px #fff, 0 0 0 5px #ffc16e;
  }
}

.link {
  color: #0086cc;
  font-size: 10px;
  font-weight: 500;
  text-decoration: none;
  position: absolute;
  top: 22px;
  left: 440px;
  display: none;
}

.is-show {
  display: block;
}

@media screen and (max-width: 640px) {
  .supporters {
    width: calc(100vw - 46px);
    margin: 16px 0 20px;
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
