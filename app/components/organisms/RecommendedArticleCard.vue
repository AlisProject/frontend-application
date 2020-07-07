<template>
  <nuxt-link
    class="recommended-article-card"
    :to="`/${article.user_id}/articles/${article.article_id}`"
  >
    <img
      v-if="isTipRanking"
      :src="require(`~/assets/images/pc/article/m_ribbon_${order}.png`)"
      class="ribbon"
      alt="Tip ranking"
    >
    <div class="eye-catch-image-box">
      <img
        v-if="article.eye_catch_url === null || article.eye_catch_url === undefined"
        class="eye-catch-image"
        src="~assets/images/pc/common/thumbnail_noimg.png"
        alt="Eye catch"
      >
      <img
        v-else
        class="eye-catch-image lazyload"
        src="~assets/images/pc/common/thumbnail_blank.png"
        :data-src="`${article.eye_catch_url}?d=592x296`"
        alt="Eye catch"
      >
    </div>
    <span class="topic">
      {{ topicDisplayName }}
    </span>
    <span v-if="isPaidArticle" class="paid-article">
      有料
    </span>
    <h2 class="title">
      {{ decodedTitle }}
    </h2>
    <no-ssr>
      <nuxt-link :to="`/users/${article.user_id}`" class="article-data-box">
        <span class="username">
          {{ decodedUsername }}
        </span>
        <span class="published-at">
          {{ formattedPublishedAt }}
        </span>
      </nuxt-link>
    </no-ssr>
    <div class="token-info">
      <div class="icons">
        <img class="icon" src="~assets/images/pc/common/icon_catset_like.png" alt="Like token">
        <img class="icon" src="~assets/images/pc/common/icon_catset_tip.png" alt="Tip token">
      </div>
      <div class="amounts">
        <span class="like-token-amount">
          {{ article.alisToken | formatTokenAmount }} <span class="unit">ALIS</span>
        </span>
        <span class="tip-token-amount">
          {{ article.tip_value | formatTokenAmount }} <span class="unit">ALIS</span>
        </span>
      </div>
    </div>
  </nuxt-link>
</template>

<script>
import { mapGetters } from 'vuex'
import { htmlDecode, formatTokenAmount } from '~/utils/article'
import { formatDate } from '~/utils/format'

export default {
  props: {
    article: {
      type: Object,
      required: true
    },
    isTipRanking: {
      type: Boolean,
      required: false,
      default: false
    },
    order: {
      type: String,
      required: false
    }
  },
  computed: {
    decodedTitle() {
      return htmlDecode(this.article.title)
    },
    decodedUsername() {
      return htmlDecode(this.article.userInfo.user_display_name)
    },
    publishedAt() {
      return this.article.published_at || this.article.created_at
    },
    formattedPublishedAt() {
      return formatDate(this.publishedAt)
    },
    topicDisplayName() {
      const topic = this.topics.find((topic) => topic.name === this.article.topic)
      return topic.display_name
    },
    isPaidArticle() {
      return !!this.article.price
    },
    ...mapGetters('article', ['topics'])
  },
  filters: {
    formatTokenAmount
  }
}
</script>

<style lang="scss" scoped>
.recommended-article-card {
  @include cassette-shadow();
  border-radius: 4px;
  height: 296px;
  position: relative;
  text-decoration: none;
  width: 340px;
}

.ribbon,
.eye-catch-image-box,
.topic,
.paid-article,
.title,
.article-data-box,
.username,
.published-at,
.token-info {
  position: absolute;
}

.ribbon {
  width: 108px;
  right: -8px;
  top: -8px;
  z-index: 1;
}

.eye-catch-image-box {
  background: #fff;
  overflow: hidden;
  width: 296px;
  height: 148px;
  top: 24px;
  left: 22px;

  .eye-catch-image {
    max-width: 100%;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}

.topic,
.paid-article {
  text-align: center;
  color: #9e9e9e;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.6px;
  padding: 4px;
  box-sizing: border-box;
  top: 152px;
  background: #fff;
}

.topic {
  width: 100px;
  left: 26px;
}

.paid-article {
  width: 40px;
  left: 130px;
}

.title {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #555555;
  display: -webkit-box;
  font-size: 14px;
  font-weight: bold;
  height: 48px;
  left: 22px;
  letter-spacing: 0.8px;
  line-height: 1.714;
  margin: 0;
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
  top: 184px;
  width: 296px;
}

.article-data-box {
  width: 220px;
  height: 46px;
  bottom: 14px;
  left: 22px;
}

.username,
.published-at {
  color: #6e6e6e;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.8px;
}

.like-token-amount,
.tip-token-amount {
  color: #333333;
  font-size: 12px;
  font-weight: bold;
  text-align: right;
}

.username {
  color: #9e9e9e;
  font-weight: bold;
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
  top: 6px;
  white-space: nowrap;
  width: 168px;
}

.published-at {
  color: #9e9e9e;
  font-weight: bold;
  bottom: 6px;
}

.token-info {
  bottom: 20px;
  right: 20px;
  display: flex;
}

.icons {
  display: flex;
  flex-direction: column;
  margin-right: 4px;
}

.icon {
  width: 16px;
}

.amounts {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.unit {
  color: #333333;
  font-size: 8px;
  font-weight: bold;
  padding: 2px 0 0 0;
}

@media screen and (max-width: 320px) {
  .recommended-article-card {
    width: 300px;
  }

  .eye-catch-image-box {
    width: 256px;
  }

  .title {
    width: 256px;
  }

  .username {
    width: 150px;
  }
}
</style>
