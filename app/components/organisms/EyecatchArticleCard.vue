<template>
  <nuxt-link
    class="eyecatch-article-card"
    :class="order"
    :to="`/${article.user_id}/articles/${article.article_id}`"
    :style="{ 'background': `url(${eyeCatchImagePath}) center center / cover no-repeat` }" >
    <h2 class="title">
      {{ decodedTitle }}
    </h2>
    <no-ssr>
      <nuxt-link :to="`/users/${article.user_id}`" class="article-data-box">
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
      </nuxt-link>
    </no-ssr>
    <span class="token-amount">
      {{ formattedTokenAmount }}
    </span>
  </nuxt-link>
</template>

<script>
import { BigNumber } from 'bignumber.js'
import { htmlDecode } from '~/utils/article'
import { formatDate } from '~/utils/format'

export default {
  props: {
    article: {
      type: Object,
      required: true
    },
    order: {
      type: String,
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
    eyeCatchImagePath() {
      return this.article.eye_catch_url !== null
        ? this.article.eye_catch_url
        : require('~/assets/images/pc/common/thumbnail_noimg.png')
    },
    formattedTokenAmount() {
      const tokenAmount = this.article.alisToken
      if (tokenAmount === undefined) return
      const stringTokenAmount = tokenAmount.toString()
      const formatNumber = 10 ** 18
      const alisToken = new BigNumber(stringTokenAmount).div(formatNumber)
      return alisToken > 999 ? (alisToken / 1000).toFixed(2, 1) + 'k' : alisToken.toFixed(2, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.eyecatch-article-card {
  @include cassette-shadow();
  border-radius: 4px;
  position: relative;
  text-decoration: none;

  &:before {
    content: '';
    border-radius: 4px;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &.eyecatch1 {
    grid-area: eyecatch1;
    width: 710px;
    height: 412px;

    &:before {
      background-image: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(0, 0, 0, 0.4) 100%);
    }
  }

  &.eyecatch2 {
    grid-area: eyecatch2;
  }

  &.eyecatch3 {
    grid-area: eyecatch3;
  }

  &.eyecatch2,
  &.eyecatch3 {
    width: 340px;
    height: 191px;

    &:before {
      background-image: linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(255, 255, 255, 0) 100%);
    }
  }
}

.title {
  -webkit-box-orient: vertical;
  color: #fff;
  display: -webkit-box;
  font-size: 20px;
  font-weight: bold;
  grid-area: title;
  letter-spacing: 1px;
  line-height: 1.5;
  margin: 0;
  overflow: hidden;
  position: absolute;
  text-decoration: none;
  text-overflow: ellipsis;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.6);
}

.eyecatch1 {
  .title {
    -webkit-line-clamp: 2;
    bottom: 80px;
    left: 20px;
    width: 492px;
  }
}

.eyecatch2,
.eyecatch3 {
  .title {
    -webkit-line-clamp: 3;
    left: 20px;
    top: 20px;
    width: 300px;
  }
}

.article-data-box {
  width: 220px;
  height: 46px;
  bottom: 14px;
  left: 20px;
  position: absolute;
}

.profile-icon {
  border-radius: 50%;
  height: 36px;
  width: 36px;
}

.username,
.published-at,
.token-amount {
  color: #ffffff;
  font-size: 12px;
  font-weight: bold;
  letter-spacing: 0.8px;
  position: absolute;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.8);
}

.username {
  left: 52px;
  overflow: hidden;
  text-decoration: none;
  text-overflow: ellipsis;
  top: 8px;
  white-space: nowrap;
  width: 190px;
}

.published-at {
  bottom: 8px;
  left: 52px;
}

.token-amount {
  align-items: center;
  background: url('~assets/images/pc/common/icon_logo_white.png') no-repeat;
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
</style>
