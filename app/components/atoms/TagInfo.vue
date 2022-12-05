<template>
  <div class="area-tag-info" :style="tagInfoStyle">
    <nuxt-link v-if="bannerUrl" :to="bannerUrl">
      <div class="banner" />
    </nuxt-link>
    <div class="header-link">
      <nuxt-link class="link-item" to="/">
        TOP /
      </nuxt-link>
      <nuxt-link class="link-item" to="/articles/popular?topic=game">
        ゲーム /
      </nuxt-link>
      <nuxt-link class="link-item" to="/nft_games">
        NFTゲームランキング /
      </nuxt-link>
      <span class="link-item">{{ nftGameInfo.name }}</span>
    </div>
    <div class="tag-title">
      <img
        alt="tag-icon"
        :src="`/d/nuxt/dist/img/static/bcg_ranking/icon/${nftGameInfo.key}.png`"
        class="tag-icon"
      >
      <p class="tag-title-text">
        {{ nftGameInfo.name }}
      </p>
      <div class="area-link-button">
        <app-button v-if="nftGameInfo.officialPageUrl" class="official-site">
          <a :href="nftGameInfo.officialPageUrl" target="_blank">
            ゲームを始める <i class="fas fa-external-link-alt" />
          </a>
        </app-button>
      </div>
    </div>
    <item-label :labelName="`${nftGameInfo.name} とは`" :addLink="addLink" :addText="addText" />
    <div class="tag-info">
      <div class="area-description">
        {{ nftGameInfo.description }}
      </div>

      <div class="area-ranking-info">
        <span
          class="ranking-info-text"
        >記事タグ：<span class="ranking-no">{{ nftGameInfo.tag_name }}</span></span>
      </div>
      <div class="area-sns">
        <span class="sns-text">SNS：</span>
        <a v-if="nftGameInfo.twitter" :href="nftGameInfo.twitter" target="_blank" class="sns-icon">
          <i class="fab fa-twitter" />
        </a>
        <a
          v-if="nftGameInfo.telegramUrl"
          :href="nftGameInfo.telegramUrl"
          target="_blank"
          class="sns-icon"
        >
          <i class="fab fa-telegram" />
        </a>
        <a v-if="nftGameInfo.discord" :href="nftGameInfo.discord" target="_blank" class="sns-icon">
          <i class="fab fa-discord" />
        </a>
      </div>
    </div>

    <item-label :labelName="`ゲーム統計情報`" :addLink="addLink" :addText="addText" />
    <div class="ranking-info">
      <div class="ranking-item">
        <div class="ranking-title">
          ALIS記事数
        </div>
        <div class="ranking-value">
          {{ nftGameInfo.tag_count ? nftGameInfo.tag_count : 0 }}
        </div>
      </div>
      <div class="ranking-item">
        <div class="ranking-title">
          ユーザー数(1日)
        </div>
        <div class="ranking-value">
          {{ nftGameInfo.active_users_today ? nftGameInfo.active_users_today : '-' }}
        </div>
      </div>
      <div class="ranking-item">
        <div class="ranking-title">
          ユーザー数(7日)
        </div>
        <div class="ranking-value">
          {{ nftGameInfo.active_users_7days ? nftGameInfo.active_users_7days : '-' }}
        </div>
      </div>
      <div class="ranking-item">
        <div class="ranking-title">
          ユーザー数(30日)
        </div>
        <div class="ranking-value">
          {{ nftGameInfo.active_users_30days ? nftGameInfo.active_users_30days : '-' }}
        </div>
      </div>
      <div class="ranking-item">
        <div class="ranking-title">
          ユーザー数(合計)
        </div>
        <div class="ranking-value">
          {{ nftGameInfo.total_users ? nftGameInfo.total_users : '-' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import AppButton from '../atoms/AppButton'
import ItemLabel from '../atoms/ItemLabel'

export default {
  components: {
    AppButton,
    ItemLabel
  },
  data() {
    return {
      addLink: '',
      addText: ''
    }
  },
  props: {
    tagInfo: {
      type: Object
    }
  },
  computed: {
    bannerUrl() {
      return this.tagInfo && this.tagInfo.bannerUrl ? this.tagInfo.bannerUrl : null
    },
    tagInfoStyle() {
      if (this.bannerUrl) {
        return {
          '--banner-background': `#fff url(${this.tagInfo.bannerUrl}) no-repeat`,
          '--banner-background-sp': `#fff url(${this.tagInfo.bannerSpUrl}) no-repeat`
        }
      }
      return null
    },
    ...mapGetters('nftGames', ['nftGameInfo'])
  },
  mounted() {
    // google optimize
    window.dataLayer.push({
      event: 'optimize.activate',
      key: this.nftGameInfo.tag_name
    })
  }
}
</script>

<style lang="scss" scoped>
.area-tag-info {
  grid-area: tag;
  padding: 0 0 5px 0;
  margin-top: -40px;
  position: relative;
  text-decoration: none;

  .banner {
    background: var(--banner-background);
    background-size: 710px auto;
    text-align: center;
    height: 130px;
    margin-bottom: 3px;
  }
  .header-link {
    .link-item {
      color: #6e6e6e;
      font-size: 14px;
      font-weight: bold;
      text-decoration: none;
      height: 14px;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .tag-title {
    display: flex;
    align-items: center;
    margin: 40px 0 15px 0;
    .tag-icon {
      width: 100px;
      height: 100px;
    }
    .tag-title-text {
      margin-left: 12px;
      color: #030303;
      font-size: 32px;
      font-weight: 600;
      font-family: Helvetica Neue, Arial, sans-serif;
      text-overflow: ellipsis;
    }
    .area-link-button {
      margin: auto 0 0 auto;
      .official-site {
        border-radius: 4px;
        box-shadow: none;
        font-size: 14px;
        font-weight: bold;
        height: 34px;
        line-height: 34px;
        width: 170px;
        &:hover,
        &:focus {
          background: #0086cc;
        }
      }
    }
  }
  .label-area {
    margin: 50px 0 15px 0;
    font-size: 18px;
    color: #0086cc;
  }
  .tag-info {
    margin-top: 8px;
    .area-description {
      font-size: 14px;
      color: #6e6e6e;
      overflow: hidden;
      text-align: left;
      text-overflow: ellipsis;
      word-break: break-all;
      margin: 5px 15px 0 0;
    }
    .area-sns {
      margin: 5px 0 15px 0;
      .sns-text {
        font-size: 14px;
        color: #6e6e6e;
      }
      .sns-icon {
        color: #030303;
        cursor: pointer;
        display: inline-block;
        font-size: 20px;
        margin-right: 3px;
      }
    }
    .area-ranking-info {
      margin: 20px 0 0 0;
      .ranking-info-text {
        font-size: 14px;
        color: #6e6e6e;
      }
      .ranking-no {
        font-size: 14px;
        font-weight: bold;
        color: #030303;
      }
      .sns-icon {
        color: #030303;
        cursor: pointer;
        display: inline-block;
        font-size: 20px;
        margin-right: 3px;
      }
    }
  }

  .ranking-info {
    display: flex;
    flex-wrap: wrap;
    .ranking-item {
      margin: 6px;
      width: calc(33% - 12px);
      height: 80px;
      border: 1px solid #cccccc;
      border-radius: 8px;
      .ranking-title {
        font-size: 12px;
        font-weight: 600;
        color: #6e6e6e;
        letter-spacing: 0.25px;
        margin: 12px 0 0 12px;
      }
      .ranking-value {
        font-size: 18px;
        font-weight: 700;
        color: #0086cc;
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
        word-break: break-all;
        margin: 12px 0 0 12px;
      }
    }
  }
  .footer-text {
    color: #6e6e6e;
    font-size: 9px;
    text-decoration: none;
    margin: 0 12px 0 12px;
  }
}

@media screen and (max-width: 920px) {
  .area-tag-info {
    box-shadow: none;
    padding: 0 0 0 0;
    margin-top: -30px;

    .banner {
      background: var(--banner-background-sp);
      background-size: 100% auto;
      text-align: center;
      margin-top: 5px;
      height: 75px;
    }

    .header-link {
      .link-item {
        font-size: 12px;
      }
    }

    .tag-title {
      margin: 15px 0 5px 0;
      flex-wrap: wrap;
      .tag-icon {
        width: 64px;
        height: 64px;
      }
      .tag-title-text {
        width: 262px;
        font-size: 24px;
      }
      .area-link-button {
        margin: 0;
        .official-site {
          margin-top: 5px;
          border-radius: 4px;
          box-shadow: none;
          font-size: 14px;
          font-weight: bold;
          height: 34px;
          line-height: 34px;
          width: 340px;
          &:hover,
          &:focus {
            background: #0086cc;
          }
        }
      }
    }

    .label-area {
      margin: 30px 0 15px 0;
      font-size: 18px;
    }
    .tag-info {
      .area-description {
        grid-area: tag-description;
        font-size: 14px;
        color: #6e6e6e;
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
        word-break: break-all;
      }
      .area-sns {
        margin-top: 5px;
        .sns-icon {
          font-size: 16px;
          margin-right: 5px;
        }
      }
    }
    .ranking-info {
      margin: 0 0 10px 0;
      .ranking-item {
        width: calc(50% - 16px);
      }
    }
  }
}
</style>
