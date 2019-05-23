<template>
  <div class="area-article-sub-infos-container">
    <div class="article-sub-infos">
      <div class="icons">
        <img class="icon" src="~assets/images/pc/article/icon_article_date.png">
        <img class="icon mt3" src="~assets/images/pc/article/icon_article_like.png">
        <img class="icon" src="~assets/images/pc/article/icon_article_tip.png">
        <img class="icon" src="~assets/images/pc/article/icon_article_supporter.png">
      </div>
      <div class="titles">
        <span class="title">公開日</span>
        <span class="title">いいねによる獲得</span>
        <span class="title">投げ銭による獲得</span>
        <span class="title">サポーター</span>
      </div>
      <div class="separators">
        <span class="separator">:</span>
        <span class="separator">:</span>
        <span class="separator">:</span>
      </div>
      <div class="values">
        <span class="value">{{ formattedPublishedAt }}</span>
        <!-- TODO: いいねによるトークン獲得のロジックを追加 -->
        <span class="value">{{ formattedTokenAmount }} ALIS</span>
        <span class="value">{{ formattedTokenAmount }} ALIS</span>
      </div>
    </div>
    <div class="supporters-wrapper">
      <div class="supporters">
        <nuxt-link
          v-for="(supporter, i) in supporters"
          :key="supporter.user_id"
          :to="`/users/${supporter.user_id}`"
          class="supporter"
        >
          <img :class="`user-icon rank${i + 1}`" :src="`${supporter.icon_image_url}?d=48x48`">
        </nuxt-link>
      </div>
      <nuxt-link class="link" :to="`/${articleUserId}/articles/${articleId}/supporters`">
        もっと見る
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { BigNumber } from 'bignumber.js'
import { formatDate } from '~/utils/format'

export default {
  props: {
    articleId: {
      type: String,
      required: true
    },
    articleUserId: {
      type: String,
      required: true
    },
    publishedAt: {
      type: Number,
      required: true
    },
    tokenAmount: {
      type: Number,
      required: true
    }
  },
  computed: {
    formattedPublishedAt() {
      return formatDate(this.publishedAt)
    },
    formattedTokenAmount() {
      if (this.tokenAmount === undefined) return
      const stringTokenAmount = this.tokenAmount.toString()
      const formatNumber = 10 ** 18
      const alisToken = new BigNumber(stringTokenAmount).div(formatNumber)
      return alisToken > 999 ? (alisToken / 1000).toFixed(2, 1) + 'k' : alisToken.toFixed(2, 1)
    },
    ...mapGetters('article', ['supporters'])
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

.mt3 {
  margin-top: 3px;
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
