<template>
  <div class="area-tag-info" :style="tagInfoStyle">
    <nuxt-link :to="tagInfo.eventUrl">
      <div class="banner" />
    </nuxt-link>
    <div class="tag-info">
      <img class="area-icon" :alt="tagInfo.iconCaption" :src="tagInfo.iconUrl">
      <div class="area-name">
        {{ tagInfo.name }}
      </div>
      <div class="area-description">
        {{ tagInfo.description }}
      </div>
      <div class="area-sns">
        <a v-if="tagInfo.twitterUrl" :href="tagInfo.twitterUrl" target="_blank" class="sns-icon">
          <i class="fab fa-twitter" />
        </a>
        <a v-if="tagInfo.telegramUrl" :href="tagInfo.telegramUrl" target="_blank" class="sns-icon">
          <i class="fab fa-telegram" />
        </a>
        <a v-if="tagInfo.discordUrl" :href="tagInfo.discordUrl" target="_blank" class="sns-icon">
          <i class="fab fa-discord" />
        </a>
      </div>
      <div class="area-link-button">
        <app-button class="official-article">
          <nuxt-link :to="tagInfo.officialArticleUrl">
            ゲームの始め方
          </nuxt-link>
        </app-button>
        <app-button class="official-site">
          <a :href="tagInfo.officialPageUrl" target="_blank">
            ゲームを始める <i class="fas fa-external-link-alt" />
          </a>
        </app-button>
      </div>
    </div>
  </div>
</template>

<script>
import AppButton from '../atoms/AppButton'

export default {
  components: {
    AppButton
  },
  props: {
    tagInfo: {
      type: Object,
      required: true
    }
  },
  computed: {
    tagInfoStyle() {
      return {
        '--banner-background': `#fff url(${this.tagInfo.bannerUrl}) no-repeat`,
        '--banner-background-sp': `#fff url(${this.tagInfo.bannerSpUrl}) no-repeat`
      }
    }
  },
  mounted() {
    // google optimize
    window.dataLayer.push({
      event: 'optimize.activate',
      key: this.tagInfo.key
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
  }
  .tag-info {
    display: grid;
    grid-template-columns: 105px 435px 170px;
    grid-template-rows: 26px 54px 26px;
    /* prettier-ignore */
    grid-template-areas:
        "tag-icon tag-name        tag-link-button"
        "tag-icon tag-description tag-link-button"
        "tag-icon tag-link-sns    tag-link-button";
    height: 106px;
    margin-top: 8px;

    .area-icon {
      grid-area: tag-icon;
      background-size: 105px;
      text-align: center;
      width: 100%;
      height: 100%;
    }
    .area-name {
      grid-area: tag-name;
      font-size: 20px;
      color: #030303;
      font-weight: bold;
      letter-spacing: 0.25px;
      margin: 0 15px 0 15px;
    }
    .area-description {
      grid-area: tag-description;
      font-size: 14px;
      color: #6e6e6e;
      overflow: hidden;
      text-align: left;
      text-overflow: ellipsis;
      word-break: break-all;
      margin: 5px 15px 0 15px;
    }
    .area-sns {
      grid-area: tag-link-sns;
      margin: 0 15px 0 15px;
      .sns-icon {
        color: #030303;
        cursor: pointer;
        display: inline-block;
        font-size: 20px;
        margin-right: 10px;
      }
    }
    .area-link-button {
      grid-area: tag-link-button;
      .official-article {
        border-radius: 4px;
        box-shadow: none;
        font-size: 14px;
        font-weight: bold;
        height: 34px;
        line-height: 34px;
        width: 170px;
        margin-top: 14px;
        background: #df772b;
        &:hover,
        &:focus {
          background: #df772b;
        }
      }
      .official-site {
        border-radius: 4px;
        box-shadow: none;
        font-size: 14px;
        font-weight: bold;
        height: 34px;
        line-height: 34px;
        width: 170px;
        margin-top: 14px;
        &:hover,
        &:focus {
          background: #0086cc;
        }
      }
    }
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
      height: 75px;
    }

    .tag-info {
      grid-template-columns: 98px minmax(0, 1fr);
      grid-template-rows: 16px 64px 26px 200px;
      /* prettier-ignore */
      grid-template-areas:
          "tag-icon        tag-name       "
          "tag-icon        tag-description"
          "tag-icon        tag-link-sns   "
          "tag-link-button tag-link-button";
      margin-top: 8px;

      .area-icon {
        background-size: 98px;
        text-align: center;
        width: 100%;
        height: 98px;
      }
      .area-name {
        grid-area: tag-name;
        font-size: 14px;
        color: #030303;
        font-weight: bold;
        letter-spacing: 0.25px;
        margin: 0 15px 0 15px;
      }
      .area-description {
        grid-area: tag-description;
        font-size: 12px;
        color: #6e6e6e;
        overflow: hidden;
        text-align: left;
        text-overflow: ellipsis;
        word-break: break-all;
        margin: 5px 0 0 15px;
      }
      .area-sns {
        .sns-icon {
          font-size: 16px;
        }
      }
      .area-link-button {
        grid-area: tag-link-button;
        .official-article {
          font-size: 12px;
          height: 31px;
          line-height: 31px;
          width: 100%;
          margin-top: 10px;
        }
        .official-site {
          font-size: 12px;
          height: 31px;
          line-height: 31px;
          width: 100%;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
