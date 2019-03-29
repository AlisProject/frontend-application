<template>
  <nuxt-link
    class="recommended-article-card"
    :to="`/${article.user_id}/articles/${article.article_id}`"
  >
    <div class="eye-catch-image-box">
      <img
        v-if="article.eye_catch_url === null || article.eye_catch_url === undefined"
        class="eye-catch-image"
        src="~assets/images/pc/common/thumbnail_noimg.png"
      >
      <img v-else class="eye-catch-image" :src="article.eye_catch_url">
    </div>
    <span class="topic">
      {{ topicDisplayName }}
    </span>
    <span v-if="!isPaidArticle" class="paid-article">
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
    <span class="token-amount">
      {{ formattedTokenAmount }}
    </span>
  </nuxt-link>
</template>

<script>
import { mapGetters } from 'vuex'
import { BigNumber } from 'bignumber.js'
import { htmlDecode } from '~/utils/article'
import { formatDate } from '~/utils/format'

export default {
  props: {
    article: {
      type: Object,
      required: true
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
    formattedTokenAmount() {
      const tokenAmount = this.article.alisToken
      if (tokenAmount === undefined) return
      const stringTokenAmount = tokenAmount.toString()
      const formatNumber = 10 ** 18
      const alisToken = new BigNumber(stringTokenAmount).div(formatNumber)
      return alisToken > 999 ? (alisToken / 1000).toFixed(2, 1) + 'k' : alisToken.toFixed(2, 1)
    },
    isPaidArticle() {
      return !!this.article.price
    },
    ...mapGetters('article', ['topics'])
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

.eye-catch-image-box,
.topic,
.paid-article,
.title,
.article-data-box,
.username,
.published-at,
.token-amount {
  position: absolute;
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
.published-at,
.token-amount {
  color: #6e6e6e;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.8px;
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

.token-amount {
  align-items: center;
  background: url('~assets/images/pc/common/icon_token_cassette.png') no-repeat;
  background-size: 18px;
  bottom: 0;
  display: flex;
  height: 18px;
  margin: 0;
  letter-spacing: 0.8px;
  padding: 0 0 0 22px;
  right: 20px;
  bottom: 20px;
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
