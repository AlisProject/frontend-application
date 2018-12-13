<template>
  <nuxt-link
    class="recommended-article-card"
    :to="`/${article.user_id}/articles/${article.article_id}`">
    <span class="topic">
      {{ topicDisplayName }}
    </span>
    <h2 class="title">
      {{ decodedTitle }}
    </h2>
    <div class="eye-catch-image-box">
      <img
        class="eye-catch-image"
        src="~assets/images/pc/common/thumbnail_noimg.png"
        v-if="article.eye_catch_url === null">
      <img
        class="eye-catch-image"
        :src="article.eye_catch_url"
        v-else>
    </div>
    <img
      class="profile-icon"
      :src="article.userInfo.icon_image_url"
      v-if="article.userInfo.icon_image_url !== undefined">
    <img
      class="profile-icon"
      src="~assets/images/pc/common/icon_user_noimg.png"
      v-else>
    <span class="username">
      {{ decodedUsername }}
    </span>
    <span class="published-at">
      {{ formattedPublishedAt }}
    </span>
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
    ...mapGetters('article', ['topics'])
  }
}
</script>

<style lang="scss" scoped>
.recommended-article-card {
  @include cassette-shadow();
  border-radius: 4px;
  height: 320px;
  position: relative;
  text-decoration: none;
  width: 340px;
}

.topic,
.eye-catch-image-box,
.title,
.profile-icon,
.username,
.published-at,
.token-amount {
  position: absolute;
}

.topic {
  color: red;
  height: 12px;
  display: flex;
  align-items: center;
  color: #6e6e6e;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.6px;
  border-left: 2px solid #0086cc;
  padding-left: 6px;
  top: 20px;
  left: 22px;
}

.eye-catch-image-box {
  background: #fff;
  overflow: hidden;
  width: 296px;
  height: 148px;
  top: 44px;
  left: 22px;

  .eye-catch-image {
    max-width: 100%;
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
}

.title {
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  color: #555555;
  display: -webkit-box;
  font-size: 14px;
  font-weight: bold;
  font-weight: bold;
  height: 48px;
  left: 22px;
  letter-spacing: 0.8px;
  line-height: 1.714;
  margin: 0;
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
  top: 204px;
  width: 296px;
}

.profile-icon {
  border-radius: 50%;
  bottom: 20px;
  height: 36px;
  left: 20px;
  width: 36px;
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
  bottom: 40px;
  left: 72px;
}

.published-at {
  bottom: 22px;
  left: 72px;
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
}
</style>
